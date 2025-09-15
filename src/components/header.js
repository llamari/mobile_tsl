import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Menu, CircleUserRound, Settings } from "lucide-react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window"); // altura da tela

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
                {[
                    { label: "Home", route: "Home" },
                    { label: "Comunicados", route: "News" },
                    { label: "Tarefas", route: "Work" },
                    { label: "Pendências", route: "Todo" },
                    { label: "Gestão de Vendas", route: "Sellings" },
                    { label: "Gestão de Estoque", route: "Inventory" },
                    { label: "Gestão de Compras", route: "Purchases" },
                    { label: "Gestão Financeira", route: "Finance" },
                    { label: "Gestão de Usuários", route: "Users" },
                    { label: "Ponto Eletrônico", route: "Attendance" },
                ].map((item) => (
                    <TouchableOpacity
                        key={item.route}
                        onPress={() => {
                            navigation.navigate(item.route);
                            setOpenMenu(false);
                        }}
                    >
                        <Text style={styles.link}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Menu color="white" size={40} onPress={toggleMenu} />
                    {/* <Image
            source={require("../../assets/icon.png")}
            style={styles.logo}
          /> */}
                </View>
                <View style={{ flexDirection: "row" }}>
                    <CircleUserRound color="white" size={40} style={{ marginRight: 16 }} />
                    <Settings color="white" size={40} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        position: "absolute",
        top: 80,
        left: 0,
        width: 240,
        height: screenHeight,
        backgroundColor: "#1C1C1C",
        padding: 20,
        zIndex: 50,
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
