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
import { Camera, Check, ImagePlus, Paperclip } from "lucide-react-native";
import { Header } from "../components/header";
import { UploadQueueList } from "../components/AttachmentList";
import { useUploadQueue } from "../hooks/useUploadQueue";
import { usePermission } from "../hooks/usePermission";
import { announcementsStore } from "../mocks";
import * as media from "../services/media";
import { pickDocuments } from "../services/documents";

const CURRENT_AUTHOR = "João Pereira - Gerente";

export function CreateAnnouncement() {
    const navigation = useNavigation();
    const queue = useUploadQueue();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);

    const cameraPermission = usePermission({
        request: media.requestCameraPermission,
        get: media.getCameraPermission,
        deniedTitle: "Câmera indisponível",
        deniedMessage: "Ative o acesso à câmera nas configurações para tirar fotos.",
    });
    const libraryPermission = usePermission({
        request: media.requestLibraryPermission,
        get: media.getLibraryPermission,
        deniedTitle: "Galeria indisponível",
        deniedMessage: "Ative o acesso às fotos nas configurações para anexar imagens.",
    });

    const takePhoto = async () => {
        if (!(await cameraPermission.ensure())) return;
        const assets = await media.takePhoto();
        if (assets.length) queue.addImages(assets);
    };

    const pickPhotos = async () => {
        if (!(await libraryPermission.ensure())) return;
        const assets = await media.pickFromLibrary();
        if (assets.length) queue.addImages(assets);
    };

    const attachDocs = async () => {
        const { files, rejected } = await pickDocuments();
        if (rejected.length) {
            Alert.alert(
                "Alguns arquivos foram ignorados",
                rejected.map((r) => `• ${r.name} (${r.reason})`).join("\n")
            );
        }
        if (files.length) queue.addDocuments(files);
    };

    const submit = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Atenção", "Preencha o título e o conteúdo do comunicado.");
            return;
        }
        setSaving(true);
        try {
            const { images, attachments } = await queue.flush();
            await announcementsStore.create({
                title: title.trim(),
                content: content.trim(),
                author: CURRENT_AUTHOR,
                date: new Date().toISOString(),
                images,
                attachments,
            });
            navigation.goBack();
        } catch (e) {
            Alert.alert(
                "Não foi possível publicar",
                e?.message ?? "Tente reenviar os anexos que falharam."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Novo comunicado</Text>

                <Text style={styles.label}>Título *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex.: Treinamento na sexta-feira"
                    placeholderTextColor="#6B7280"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Conteúdo *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Escreva o comunicado..."
                    placeholderTextColor="#6B7280"
                    value={content}
                    onChangeText={setContent}
                    multiline
                />

                <View style={styles.attachBar}>
                    <TouchableOpacity style={styles.attachButton} onPress={takePhoto}>
                        <Camera color="#FE5F2F" size={20} />
                        <Text style={styles.attachText}>Câmera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attachButton} onPress={pickPhotos}>
                        <ImagePlus color="#FE5F2F" size={20} />
                        <Text style={styles.attachText}>Galeria</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attachButton} onPress={attachDocs}>
                        <Paperclip color="#FE5F2F" size={20} />
                        <Text style={styles.attachText}>Documento</Text>
                    </TouchableOpacity>
                </View>

                <UploadQueueList
                    items={queue.items}
                    onRemove={queue.remove}
                    onRetry={queue.retry}
                />

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={submit}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Check color="white" size={20} />
                            <Text style={styles.saveText}>Publicar comunicado</Text>
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
    label: { color: "#D1D5DB", fontSize: 13, marginBottom: 6, marginTop: 12 },
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
    textArea: { minHeight: 120, textAlignVertical: "top" },
    attachBar: { flexDirection: "row", gap: 10, marginTop: 20 },
    attachButton: {
        flex: 1,
        alignItems: "center",
        gap: 4,
        backgroundColor: "#1C1C1C",
        borderWidth: 1,
        borderColor: "#FE5F2F",
        borderRadius: 10,
        paddingVertical: 14,
    },
    attachText: { color: "white", fontSize: 12, fontWeight: "600" },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#FE5F2F",
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: 28,
    },
    saveText: { color: "white", fontSize: 16, fontWeight: "700" },
});
