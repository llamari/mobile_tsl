import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Mail, MapPin, Phone, Route, UserPlus } from "lucide-react-native";
import { Header } from "../components/header";
import { SupplierMap } from "../components/SupplierMap";
import { useRecord } from "../hooks/useCollection";
import { usePermission } from "../hooks/usePermission";
import { suppliersStore } from "../mocks";
import { navigationUrl } from "../services/location";
import {
    getPermission,
    requestPermission,
    saveSupplierAsContact,
} from "../services/contacts";

function Action({ icon: Icon, label, onPress, disabled }) {
    return (
        <TouchableOpacity
            style={[styles.action, disabled && styles.actionDisabled]}
            onPress={onPress}
            disabled={disabled}
        >
            <Icon color="#FE5F2F" size={22} />
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

export function SupplierDetail() {
    const { params } = useRoute();
    const { data: supplier, loading } = useRecord(suppliersStore, params?.id);
    const [savingContact, setSavingContact] = useState(false);

    const contactPermission = usePermission({
        request: requestPermission,
        get: getPermission,
        deniedTitle: "Acesso aos contatos negado",
        deniedMessage:
            "Para salvar o fornecedor na sua agenda, ative o acesso aos contatos nas configurações.",
    });

    if (loading) {
        return (
            <View style={styles.container}>
                <Header />
                <ActivityIndicator color="#FE5F2F" style={{ marginTop: 40 }} />
            </View>
        );
    }

    if (!supplier) {
        return (
            <View style={styles.container}>
                <Header />
                <Text style={styles.notFound}>Fornecedor não encontrado.</Text>
            </View>
        );
    }

    const hasCoords = supplier.latitude != null && supplier.longitude != null;

    const openRoute = () => {
        if (!hasCoords) return;
        Linking.openURL(
            navigationUrl({
                latitude: supplier.latitude,
                longitude: supplier.longitude,
                label: supplier.name,
            })
        );
    };

    const call = () =>
        supplier.phone && Linking.openURL(`tel:${supplier.phone.replace(/\s/g, "")}`);
    const email = () => supplier.email && Linking.openURL(`mailto:${supplier.email}`);

    const saveToContacts = async () => {
        if (!(await contactPermission.ensure())) return;
        try {
            setSavingContact(true);
            await saveSupplierAsContact(supplier);
            Alert.alert("Pronto", `${supplier.name} foi salvo nos seus contatos.`);
        } catch (e) {
            Alert.alert("Erro", "Não foi possível salvar o contato.");
        } finally {
            setSavingContact(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>{supplier.name}</Text>
                <Text style={styles.category}>{supplier.category}</Text>

                {hasCoords && (
                    <View style={styles.mapWrap}>
                        <SupplierMap
                            suppliers={[supplier]}
                            selectedId={supplier.id}
                            region={{
                                latitude: supplier.latitude,
                                longitude: supplier.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        />
                    </View>
                )}

                <View style={styles.card}>
                    <Row icon={MapPin} value={supplier.address} />
                    {supplier.phone ? <Row icon={Phone} value={supplier.phone} /> : null}
                    {supplier.email ? <Row icon={Mail} value={supplier.email} /> : null}
                    {supplier.notes ? (
                        <Text style={styles.notes}>{supplier.notes}</Text>
                    ) : null}
                </View>

                <View style={styles.actions}>
                    <Action
                        icon={Route}
                        label="Traçar rota"
                        onPress={openRoute}
                        disabled={!hasCoords}
                    />
                    <Action
                        icon={Phone}
                        label="Ligar"
                        onPress={call}
                        disabled={!supplier.phone}
                    />
                    <Action
                        icon={Mail}
                        label="E-mail"
                        onPress={email}
                        disabled={!supplier.email}
                    />
                    <Action
                        icon={UserPlus}
                        label={savingContact ? "Salvando..." : "Salvar contato"}
                        onPress={saveToContacts}
                        disabled={savingContact}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

function Row({ icon: Icon, value }) {
    return (
        <View style={styles.row}>
            <Icon color="#9CA3AF" size={18} />
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: "#0F0F0F", flex: 1 },
    scroll: { padding: 20 },
    title: { color: "white", fontSize: 26, fontWeight: "600" },
    category: { color: "#FE5F2F", fontSize: 14, fontWeight: "700", marginTop: 4 },
    mapWrap: {
        height: 180,
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 16,
    },
    card: {
        backgroundColor: "#1C1C1C",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#9CA3AF",
        marginTop: 16,
        gap: 12,
    },
    row: { flexDirection: "row", alignItems: "center", gap: 10 },
    rowValue: { color: "white", fontSize: 14, flex: 1 },
    notes: {
        color: "#D1D5DB",
        fontSize: 13,
        fontStyle: "italic",
        marginTop: 4,
    },
    actions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 20,
    },
    action: {
        flexGrow: 1,
        flexBasis: "44%",
        backgroundColor: "#1C1C1C",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FE5F2F",
        paddingVertical: 16,
        alignItems: "center",
        gap: 6,
    },
    actionDisabled: { opacity: 0.4, borderColor: "#9CA3AF" },
    actionLabel: { color: "white", fontSize: 13, fontWeight: "600" },
    notFound: { color: "#9CA3AF", textAlign: "center", marginTop: 40 },
});
