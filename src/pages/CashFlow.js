import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Header } from "../components/header";
import { BankingTransactions } from "../components/bankingTransactions";
import Transactions from "../utils/CashFlow.json";

export function CashFlow() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        setTransactions(Transactions);
    }, []);

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <Text style={styles.title}>Fluxo Caixa</Text>
            </View>
            <View style={styles.subheader}>
                <Text style={styles.subtitle}>
                    Confira todas as suas transações, tudo que foi comprado, quanto foi gasto,
                    suas vendas e quanto foi ganho.
                </Text>
            </View>
            <View style={styles.cardContainer}>
                <View style={styles.lineContainer}>
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <BankingTransactions item={item} />}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
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
        padding: 30
    },
    title: {
        color: "white",
        fontSize: 28,
        fontWeight: "600",
    },
    subheader: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 5,
        marginBottom: 35,
    },
    subtitle: {
        color: "white",
        fontSize: 15,
    },
    cardContainer: {
        flex: 1,
        width: "100%",
    },
    lineContainer: {
        borderLeftWidth: 2,
        borderLeftColor: '#fe5f2f',
        paddingLeft: 20,
        marginLeft: 30,
    },
    listContent: {
        paddingBottom: 24,
    },
})