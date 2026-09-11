import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BookUser, Check } from "lucide-react-native";
import { Header } from "../components/header";
import { suppliersStore } from "../mocks";
import { geocodeAddress } from "../services/location";
import { pickContact } from "../services/contacts";

const FIELDS = [
    { key: "name", label: "Nome *", placeholder: "Distribuidora ..." },
    { key: "category", label: "Categoria", placeholder: "Bebidas, Carnes ..." },
    { key: "phone", label: "Telefone", placeholder: "+55 11 ...", keyboardType: "phone-pad" },
    { key: "email", label: "E-mail", placeholder: "vendas@...", keyboardType: "email-address" },
    { key: "address", label: "Endereço", placeholder: "Rua, número, bairro, cidade" },
    { key: "notes", label: "Observações", placeholder: "Prazo de entrega, contato ...", multiline: true },
];

export function CreateSupplier() {
    const navigation = useNavigation();
    const [form, setForm] = useState({
        name: "",
        category: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
    });
    const [saving, setSaving] = useState(false);

    const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    const importContact = async () => {
        try {
            const picked = await pickContact();
            if (!picked) return;
            setForm((f) => ({
                ...f,
                name: picked.name || f.name,
                phone: picked.phone || f.phone,
                email: picked.email || f.email,
                address: picked.address || f.address,
            }));
        } catch {
            Alert.alert("Erro", "Não foi possível abrir os contatos.");
        }
    };

    const save = async () => {
        if (!form.name.trim()) {
            Alert.alert("Atenção", "Informe o nome do fornecedor.");
            return;
        }
        setSaving(true);
        try {
            const coords = form.address ? await geocodeAddress(form.address) : null;
            await suppliersStore.create({
                ...form,
                name: form.name.trim(),
                latitude: coords?.latitude ?? null,
                longitude: coords?.longitude ?? null,
            });
            navigation.goBack();
        } catch {
            Alert.alert("Erro", "Não foi possível salvar o fornecedor.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Novo fornecedor</Text>

                <TouchableOpacity style={styles.importButton} onPress={importContact}>
                    <BookUser color="#FE5F2F" size={20} />
                    <Text style={styles.importText}>Importar do catálogo de contatos</Text>
                </TouchableOpacity>

                {FIELDS.map((field) => (
                    <View key={field.key} style={styles.fieldGroup}>
                        <Text style={styles.label}>{field.label}</Text>
                        <TextInput
                            style={[styles.input, field.multiline && styles.inputMultiline]}
                            placeholder={field.placeholder}
                            placeholderTextColor="#6B7280"
                            value={form[field.key]}
                            onChangeText={(t) => set(field.key, t)}
                            keyboardType={field.keyboardType}
                            multiline={field.multiline}
                            autoCapitalize={field.key === "email" ? "none" : "sentences"}
                        />
                    </View>
                ))}

                <Text style={styles.hint}>
                    Se o endereço for preenchido, tentamos localizar o ponto no mapa
                    automaticamente.
                </Text>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={save}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Check color="white" size={20} />
                            <Text style={styles.saveText}>Salvar fornecedor</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: "#0F0F0F", flex: 1 },
    scroll: { padding: 20 },
    title: { color: "white", fontSize: 26, fontWeight: "600", marginBottom: 16 },
    importButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#1C1C1C",
        borderWidth: 1,
        borderColor: "#FE5F2F",
        borderRadius: 10,
        padding: 14,
        marginBottom: 20,
    },
    importText: { color: "white", fontWeight: "600" },
    fieldGroup: { marginBottom: 16 },
    label: { color: "#D1D5DB", fontSize: 13, marginBottom: 6 },
    input: {
        backgroundColor: "#1C1C1C",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#9CA3AF",
        color: "white",
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
    },
    inputMultiline: { minHeight: 80, textAlignVertical: "top" },
    hint: { color: "#6B7280", fontSize: 12, marginBottom: 20 },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#FE5F2F",
        borderRadius: 12,
        paddingVertical: 16,
    },
    saveText: { color: "white", fontSize: 16, fontWeight: "700" },
});
