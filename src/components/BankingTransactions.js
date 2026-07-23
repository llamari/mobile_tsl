import { StyleSheet, Text, View } from "react-native";
import { format } from "date-fns";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react-native";

export function BankingTransactions({ item }) {
    const priceFormatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(item?.value ?? 0);

    const dateFormatted = format(new Date(item?.date), "dd/MM/yyyy");
    const timeFormatted = format(new Date(item?.date), "HH:mm");

    return (
        <View style={styles.cardsContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{item?.title}</Text>
            </View>
            <View style={styles.valueContainer}>
                {item?.type === "sale" ? (
                    <BanknoteArrowUp color="#22c55e" size={20} />
                ) : (
                    <BanknoteArrowDown color="#ef4444" size={20} />
                )}
                <Text style={styles.value}>{priceFormatted}</Text>
            </View>
            <View style={styles.dateContainer}>
                <Text style={styles.date}>{dateFormatted} - {timeFormatted}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardsContainer: {
        backgroundColor: "#1C1C1C",
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#9CA3AF",
    },
    titleContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    valueContainer: {
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    value: {
        fontSize: 16,
        color: "white",
    },
    dateContainer: {
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: "#D1D5DB",
    },
});