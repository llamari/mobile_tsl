import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Animated,
} from "react-native";
import { ArrowRight, Filter, Paperclip, Plus, Search } from "lucide-react-native";
import { format } from "date-fns";
import { Header } from "../components/header";
import { useNavigation } from "@react-navigation/native";
import { useCollection } from "../hooks/useCollection";
import { announcementsStore } from "../mocks";

// componente pra CADA comunicado
function NewsCard({ item }) {
    const navigation = useNavigation();
    const translateX = useRef(new Animated.Value(0)).current;
    const cover = item.images?.[0]?.url;
    const attachmentCount = item.attachments?.length ?? 0;

    const handlePressIn = () => {
        Animated.spring(translateX, { toValue: 8, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        navigation.navigate("SpecificPostPage", { id: item.id });
    };

    return (
        <View style={styles.card}>
            {cover && <Image source={{ uri: cover }} style={styles.cover} />}
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.cardContent}>
                <Text style={styles.cardInfo}>
                    {format(new Date(item.date), "dd/MM/yyyy")}
                </Text>
                {attachmentCount > 0 && (
                    <View style={styles.attachRow}>
                        <Paperclip color="#9CA3AF" size={14} />
                        <Text style={styles.attachText}>
                            {attachmentCount} anexo{attachmentCount > 1 ? "s" : ""}
                        </Text>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.seeMore}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Text style={styles.highlight}>Ver mais detalhes</Text>
                    <Animated.View style={{ transform: [{ translateX }] }}>
                        <ArrowRight color="#FE5F2F" size={18} />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export function EmployeeNewsPage() {
    const navigation = useNavigation();
    const { data, loading } = useCollection(announcementsStore);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!isSearching) setSearchTerm("");
    }, [isSearching]);

    const filteredPosts = useMemo(
        () =>
            data.filter((post) =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [data, searchTerm]
    );

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <Text style={styles.title}>Comunicados</Text>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setIsSearching(!isSearching)}
                >
                    <Filter color="white" size={20} />
                    <Text style={styles.filterText}> Filtrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("CreateAnnouncement")}
                >
                    <Plus color="white" size={20} />
                </TouchableOpacity>
            </View>

            {isSearching && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar comunicado"
                        placeholderTextColor="#aaa"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <Search color="#f97316" size={22} />
                </View>
            )}

            <View style={styles.postsContainer}>
                {loading ? (
                    <ActivityIndicator color="#FE5F2F" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={filteredPosts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <NewsCard item={item} />}
                        ListEmptyComponent={
                            <Text style={styles.empty}>Nenhum comunicado encontrado.</Text>
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0F0F0F",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flex: 1,
    },
    header: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    title: { color: "white", fontSize: 28, fontWeight: "600" },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1C1C1C",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#FE5F2F",
    },
    filterText: { color: "white", fontWeight: "600", marginLeft: 4 },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FE5F2F",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#FE5F2F",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#FE5F2F",
        marginTop: 20,
        marginHorizontal: 20,
        paddingBottom: 4,
    },
    input: { flex: 1, color: "white", fontSize: 16, marginRight: 10 },
    postsContainer: { gap: 16, padding: 20, flex: 1 },
    card: {
        backgroundColor: "#1C1C1C",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#9CA3AF",
        marginBottom: 20,
    },
    cover: {
        width: "100%",
        height: 140,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#0F0F0F",
    },
    separator: { height: 1, backgroundColor: "#9CA3AF", marginVertical: 12 },
    cardHeader: { marginBottom: 10 },
    cardTitle: { color: "white", fontSize: 20, fontWeight: "600" },
    cardContent: { gap: 6 },
    cardInfo: { color: "white", fontSize: 14 },
    attachRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    attachText: { color: "#9CA3AF", fontSize: 13 },
    seeMore: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
    },
    highlight: { color: "#FE5F2F" },
    empty: { color: "#9CA3AF", textAlign: "center", marginTop: 40 },
});
