import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { List, MapPin, Plus, Navigation } from "lucide-react-native";
import { Header } from "../components/header";
import { SupplierMap } from "../components/SupplierMap";
import { useCollection } from "../hooks/useCollection";
import { suppliersStore } from "../mocks";
import { getUserLocation, distanceKm } from "../services/location";

function SupplierRow({ item, distance, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.badge}>{item.category}</Text>
            </View>
            <View style={styles.separator} />
            <Text style={styles.cardInfo}>{item.address}</Text>
            {distance != null && (
                <View style={styles.distanceRow}>
                    <Navigation color="#FE5F2F" size={14} />
                    <Text style={styles.distanceText}>
                        {distance < 1
                            ? `${Math.round(distance * 1000)} m`
                            : `${distance.toFixed(1)} km`}{" "}
                        de você
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

export function Suppliers() {
    const navigation = useNavigation();
    const { data, loading } = useCollection(suppliersStore);
    const [view, setView] = useState("list");
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        getUserLocation().then(setUserLocation);
    }, []);

    const suppliers = useMemo(() => {
        if (!userLocation) return data;
        return [...data]
            .map((s) => ({
                ...s,
                _distance:
                    s.latitude != null
                        ? distanceKm(userLocation, {
                              latitude: s.latitude,
                              longitude: s.longitude,
                          })
                        : null,
            }))
            .sort((a, b) => (a._distance ?? 1e9) - (b._distance ?? 1e9));
    }, [data, userLocation]);

    const openDetail = (supplier) =>
        navigation.navigate("SupplierDetail", { id: supplier.id });

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <Text style={styles.title}>Fornecedores</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setView(view === "list" ? "map" : "list")}
                    >
                        {view === "list" ? (
                            <MapPin color="white" size={20} />
                        ) : (
                            <List color="white" size={20} />
                        )}
                        <Text style={styles.toggleText}>
                            {view === "list" ? " Mapa" : " Lista"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate("CreateSupplier")}
                    >
                        <Plus color="white" size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator color="#FE5F2F" style={{ marginTop: 40 }} />
            ) : view === "map" ? (
                <View style={styles.mapWrap}>
                    <SupplierMap
                        suppliers={data}
                        userLocation={userLocation}
                        onSelect={openDetail}
                    />
                </View>
            ) : (
                <FlatList
                    data={suppliers}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <SupplierRow
                            item={item}
                            distance={item._distance}
                            onPress={() => openDetail(item)}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.empty}>Nenhum fornecedor cadastrado.</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: "#0F0F0F", flex: 1 },
    header: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
    title: { color: "white", fontSize: 28, fontWeight: "600" },
    toggleButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1C1C1C",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#FE5F2F",
    },
    toggleText: { color: "white", fontWeight: "600", marginLeft: 4 },
    addButton: {
        backgroundColor: "#FE5F2F",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    mapWrap: { flex: 1, margin: 20, borderRadius: 12, overflow: "hidden" },
    listContent: { padding: 20, paddingTop: 0 },
    card: {
        backgroundColor: "#1C1C1C",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#9CA3AF",
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: { color: "white", fontSize: 18, fontWeight: "600", flex: 1 },
    badge: {
        color: "#FE5F2F",
        fontSize: 12,
        fontWeight: "700",
        borderWidth: 1,
        borderColor: "#FE5F2F",
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        overflow: "hidden",
    },
    separator: { height: 1, backgroundColor: "#9CA3AF", marginVertical: 12 },
    cardInfo: { color: "white", fontSize: 14 },
    distanceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 8,
    },
    distanceText: { color: "#D1D5DB", fontSize: 13 },
    empty: { color: "#9CA3AF", textAlign: "center", marginTop: 40 },
});
