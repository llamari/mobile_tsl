import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, SectionList, FlatList, Animated, Dimensions } from "react-native";
import { ArrowRight, Filter, Search } from "lucide-react-native";
import { format } from "date-fns";
import { Header } from "../components/header";
import Posts from '../utils/Posts.json';

function NewsCard({ item }) {
    const translateX = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.spring(translateX, {
            toValue: 8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.cardContent}>
                <Text style={styles.cardInfo}>
                    {format(new Date(item.date), "dd/MM/yyyy")}
                </Text>
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
    const [filteredPosts, setFilteredPosts] = useState(Posts);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setFilteredPosts(
            Posts.filter((post) =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm]);

    useEffect(() => {
        if (!isSearching) {
            setSearchTerm("");
        }
    }, [isSearching]);

    return (
        <View style={styles.container}>
            <Header />
            {/* Título + Botão */}
            <View style={styles.header}>
                <Text style={styles.title}>Comunicados</Text>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setIsSearching(!isSearching)}
                >
                    <Filter color="white" size={20} />
                    <Text style={styles.filterText}> Filtrar</Text>
                </TouchableOpacity>
            </View>

            {/* Barra de busca */}
            {isSearching && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar comunicado"
                        placeholderTextColor="#aaa"
                        value={searchTerm}
                        onChangeText={(text) => setSearchTerm(text)}
                    />
                    <Search color="#f97316" size={22} />
                </View>
            )}

            {/* Posts */}
            <View style={styles.postsContainer}>
                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <NewsCard item={item} />}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    contentContainerStyle={{ paddingBottom: 32 }}
                />
            </View>

            <View style={{ height: 50, backgroundColor: "#0F0F0F", justifyContent: "center", alignItems: "center" }}>
                <Text> teste</Text>
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
    title: {
        color: "white",
        fontSize: 28,
        fontWeight: "600",
    },
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
    filterText: {
        color: "white",
        fontWeight: "600",
        marginLeft: 4,
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
    input: {
        flex: 1,
        color: "white",
        fontSize: 16,
        marginRight: 10,
    },
    postsContainer: {
        gap: 16,
        padding: 20,
        flex: 1,
    },
    card: {
        backgroundColor: "#1C1C1C",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#9CA3AF",
        marginBottom: 20,
    },
    separator: {
        height: 1,
        backgroundColor: "#9CA3AF",
        marginVertical: 12,
    },
    cardHeader: {
        marginBottom: 10,
    },
    cardTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "600",
    },
    cardContent: {
        gap: 6,
    },
    cardInfo: {
        color: "white",
        fontSize: 14,
    },
    seeMore: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
    },
    highlight: {
        color: "#FE5F2F",
    },
    cardText: {
        color: "white",
        fontSize: 14,
        marginTop: 6,
    },
});
