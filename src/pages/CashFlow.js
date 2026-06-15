import { useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Header } from "../components/header";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { format } from "date-fns";


export function CashFlow() {

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <Text style={styles.title}>Fluxo Caixa</Text>
            </View>

            <View style={styles.cardContainer}>

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
        flex: 1
    },
    header: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20
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
})