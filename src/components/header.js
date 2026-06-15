import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Menu, CircleUserRound, Settings } from "lucide-react-native";

//pega a altura e largura da tela
const { height: screenHeight, width: screenWidth } = Dimensions.get("window"); // altura da tela

const routes = [ //todas as rotas, tendo o nome e o "endereço"
    { label: "Home", route: "Home" },
    { label: "Comunicados", route: "EmployeeNewsPage" },
    { label: "Tarefas", route: "Work" },
    { label: "Pendências", route: "Todo" },
    { label: "Gestão de Vendas", route: "Sellings" },
    { label: "Gestão de Estoque", route: "Inventory" },
    { label: "Gestão de Compras", route: "Purchases" },
    { label: "Gestão Financeira", route: "CashFlow" },
    { label: "Gestão de Usuários", route: "Users" },
    { label: "Ponto Eletrônico", route: "Attendance" },
];

export function Header() {
    const [openMenu, setOpenMenu] = useState(false);
    const navigation = useNavigation();

    const slideAnim = useRef(new Animated.Value(-240)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: openMenu ? 0 : -240,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [openMenu]);

    function toggleMenu() {
        setOpenMenu((prev) => !prev);
    }

    return (
        <View style={{ width: screenWidth }}>
            {/* Sidebar */}
            <Animated.View
                style={[
                    styles.sidebar,
                    {
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                {/*essas rotas ainda não existem */}
                {/* mapeia todas as rotas e renderiza um touchableOpacity pra cada */}
                <FlatList
                    data={routes}
                    keyExtractor={(route) => route.label}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(item.route);
                                setOpenMenu(false);
                            }}
                        >
                            <Text style={styles.link}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                />
            </Animated.View>

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Menu color="white" size={40} onPress={toggleMenu} />
                </View>
                <View style={{ flexDirection: "row" }}>
                    <CircleUserRound color="white" size={40} style={{ marginRight: 16 }} />
                    <Settings color="white" size={40} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({ //estilização :))
    sidebar: {
        position: "absolute",
        top: 80,
        left: 0,
        width: 240,
        height: screenHeight,
        backgroundColor: "#1C1C1C",
        padding: 20,
        zIndex: 999,
    elevation: 999,
    },
    link: {
        color: "white",
        fontSize: 16,
        marginVertical: 8,
    },
    header: {
        height: 80,
        backgroundColor: "#1C1C1C",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    logo: {
        width: 48,
        height: 48,
        marginLeft: 8,
    },
});
