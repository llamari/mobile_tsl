import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, SectionList, FlatList, Animated } from "react-native";
import { ArrowRight, Filter, Search } from "lucide-react-native";
import { format } from "date-fns";
import { Header } from "../components/header";

const Posts = [
    {
        id: 1,
        title: "Semana de Promoções Começa Segunda-Feira",
        author: "João Pereira - Gerente",
        date: "2025-08-05T08:30:00Z",
        content:
            "Pessoal, na próxima semana iniciaremos a campanha de promoções de inverno. Todos devem conferir os preços atualizados no sistema e organizar os produtos nas prateleiras até domingo à noite.",
        image: [
            "https://wallpapers.com/images/hd/bee-pictures-y0nui2vunuctxbkz.jpg",
            "https://blog.petdoginbox.com.br/wp-content/uploads/2023/04/1679342782_bf19eb_pequeninos_e_fofinhos_confira_5_curiosidades_sobre_os_adoraveis_hamsters.jpeg",
        ],
    },
    {
        id: 2,
        title: "Treinamento de Atendimento ao Cliente",
        author: "João Pereira - Gerente",
        date: "2025-07-28T14:00:00Z",
        content:
            "Teremos um treinamento obrigatório de atendimento ao cliente nesta sexta-feira, às 18h, na sala de reuniões. Conto com a presença de todos.",
        image: ["https://i.pinimg.com/236x/a8/a2/bb/a8a2bb179ffb3050db31da7538a49320.jpg"],
    },
    {
        id: 3,
        title: "Reforço na Limpeza do Estoque",
        author: "João Pereira - Gerente",
        date: "2025-07-20T09:15:00Z",
        content:
            "Precisamos manter o estoque limpo e organizado. Peço que cada setor separe 30 minutos na quarta-feira para fazer a verificação e limpeza das prateleiras.",
        image: ["https://i.pinimg.com/474x/49/6d/b3/496db36e4eb675c7b3986878d5e184ac.jpg"],
    },
    {
        id: 4,
        title: "Novos Procedimentos para o Caixa",
        author: "João Pereira - Gerente",
        date: "2025-07-10T11:45:00Z",
        content:
            "A partir desta semana, os caixas deverão conferir o troco e assinar o relatório de fechamento antes de entregar ao financeiro. Isso ajudará a evitar divergências.",
        image: ["https://preview.redd.it/ukr6be5lvmg71.jpg?width=640&crop=smart&auto=webp&s=7dcf409b11d9c71dd7b23a61c5b69a2d6e562dff"],
    },
    {
        id: 5,
        title: "Parabéns à Equipe pelo Recorde de Vendas!",
        author: "João Pereira - Gerente",
        date: "2025-06-30T17:00:00Z",
        content:
            "Este mês batemos o recorde de vendas da loja! Obrigado pelo esforço e dedicação de todos. Vamos continuar com esse ritmo!",
        image: [
            "https://static.todamateria.com.br/upload/sh/ut/shutterstock1411747946-cke.jpg",
            "https://marketplace.canva.com/MADAUzWiF5E/1/thumbnail_large-1/canva-kitten-MADAUzWiF5E.jpg",
        ],
    },
];

export function EmployeeNewsPage() {
    const [filteredPosts, setFilteredPosts] = useState(Posts);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
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
                    renderItem={({ item }) => (
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
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0F0F0F",
        flex: 1,
    },
    header: {
        marginTop: 80,
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
        marginTop: 20,
        gap: 16,
        padding: 20,
        paddingTop: 0,
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
