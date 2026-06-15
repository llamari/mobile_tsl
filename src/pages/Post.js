import { useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Header } from "../components/header";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { format } from "date-fns";
import Posts from '../utils/Posts.json'

export function SpecificPostPage(id) {
    const [Post, setPost] = useState();
    const navigation = useNavigation();

    useEffect(() => {
        const p = Posts.filter((p) => p.id == id)
        setPost(p)
    }, [id])


    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <Text style={styles.title}>Comunicado</Text>
            </View>

            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{Post?.title}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardInfo}>
                            <Text style={styles.cardTopic}>Autor: </Text>{Post?.author}
                        </Text>
                        {/* <Text style={styles.cardInfo}>
                            <Text style={styles.cardTopic}>Data: </Text>{format(new Date(Post?.date), "dd/MM/yyyy")} 
                        </Text>
                        <Text style={styles.cardInfo}>
                            <Text style={styles.cardTopic}>Horário: </Text>{format(new Date(Post?.date), "HH:mm")}
                        </Text> */}
                    </View>
                    <View style={styles.postContent}>
                        <Text style={styles.cardInfo}>
                            {Post?.content}
                        </Text>
                    </View>
                </View>
            </View>
        </View>

    )
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
    cardContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        backgroundColor: "#1C1C1C",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#9CA3AF",
        marginBottom: 20,
        maxWidth: "90%",
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
    cardTopic: {
        color: "#fe5f2f",
        fontWeight: '700'
    },
    cardInfo: {
        color: "white",
        fontSize: 14,
    },
    postContent: {
        marginTop: 25
    }
})