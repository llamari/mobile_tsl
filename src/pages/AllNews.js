import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Animated } from "react-native";
import { ArrowRight, Filter, Search } from "lucide-react-native";
import { format } from "date-fns";
import { Header } from "../components/header";
import Posts from '../utils/Posts.json';

//componente pra CADA comunicado
function NewsCard({ item }) { //eu podia colocar tudo direto no flatlist mas eu fiz um componente só pra isso pra ficar mais organizado e as animações das setinhas funcionarem
    const translateX = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => { //quando clica, a setinha vai 8 pixels pra direita
        Animated.spring(translateX, {
            toValue: 8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => { //quando solta, a setinha volta pro lugar :))
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
                    {format(new Date(item.date), "dd/MM/yyyy")} {/*essa parte usa o date-fns pra formatar a data*/}
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
    }, [searchTerm]); //toda vez q o termo de pesquisa muda, ele refiltra os posts e coloca no FilteredPosts só os q incluem aquela string

    useEffect(() => {
        if (!isSearching) {
            setSearchTerm("");
        }
    }, [isSearching]); //quando abre ou fecha a parte de pesquisa, ele limpa o termo de pesquisa

    return (
        <View style={styles.container}>
            {/*aqui ele chama a header que tá em ../components/header*/}
            <Header />
            {/* título + botão */}
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

            {/* barra de busca */}
            {/* só aparece se isSearching for verdade */}
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
                {/* flatlist pra mapear todos os posts e fazer um card pra cada */}
                <FlatList
                    data={filteredPosts} 
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <NewsCard item={item} />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({ //estilização
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
