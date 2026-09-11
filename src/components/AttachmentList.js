import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FileText, RotateCw, X } from "lucide-react-native";
import { formatBytes, openDocument } from "../services/documents";

export function AttachmentList({ attachments = [] }) {
    const [openingId, setOpeningId] = useState(null);

    if (!attachments.length) return null;

    const open = async (att) => {
        try {
            setOpeningId(att.id);
            await openDocument(att);
        } finally {
            setOpeningId(null);
        }
    };

    return (
        <View style={styles.group}>
            {attachments.map((att, i) => (
                <TouchableOpacity
                    key={i}
                    style={styles.row}
                    onPress={() => open(att)}
                >
                    <FileText color="#FE5F2F" size={22} />
                    <View style={styles.rowText}>
                        <Text style={styles.name} numberOfLines={1}>
                            {att?.name || ""}
                        </Text>
                        {att?.size ? (
                            <Text style={styles.meta}>{formatBytes(att.size)}</Text>
                        ) : null}
                    </View>
                    {openingId === att?.id && (
                        <ActivityIndicator color="#9CA3AF" size="small" />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

/**
 * EDIT MODE — pending uploads with progress, remove and retry.
 * `items` come from useUploadQueue().
 */
export function UploadQueueList({ items = [], onRemove, onRetry }) {
    if (!items.length) return null;

    return (
        <View style={styles.group}>
            {items.map((it) => (
                <View key={it.key} style={styles.queueRow}>
                    {it.kind === "image" ? (
                        <Image source={{ uri: it.localUri }} style={styles.thumb} />
                    ) : (
                        <FileText color="#FE5F2F" size={22} />
                    )}
                    <View style={styles.rowText}>
                        <Text style={styles.name} numberOfLines={1}>
                            {it.name}
                        </Text>
                        <Text style={styles.meta}>{statusLabel(it)}</Text>
                    </View>
                    {it.status === "error" && (
                        <TouchableOpacity onPress={() => onRetry?.(it.key)} hitSlop={10}>
                            <RotateCw color="#FE5F2F" size={18} />
                        </TouchableOpacity>
                    )}
                    {it.status !== "uploading" && (
                        <TouchableOpacity onPress={() => onRemove?.(it.key)} hitSlop={10}>
                            <X color="#9CA3AF" size={18} />
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
}

function statusLabel(it) {
    switch (it.status) {
        case "pending":
            return "aguardando envio";
        case "uploading":
            return `enviando... ${Math.round((it.progress ?? 0) * 100)}%`;
        case "done":
            return "enviado";
        case "error":
            return it.error ?? "falha no envio";
        default:
            return "";
    }
}

const styles = StyleSheet.create({
    group: { gap: 10, marginTop: 12 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#1C1C1C",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#9CA3AF",
        padding: 12,
    },
    queueRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#1C1C1C",
        borderRadius: 10,
        padding: 10,
    },
    rowText: { flex: 1 },
    name: { color: "white", fontSize: 14, fontWeight: "600" },
    meta: { color: "#9CA3AF", fontSize: 12, marginTop: 2 },
    thumb: { width: 40, height: 40, borderRadius: 6, backgroundColor: "#0F0F0F" },
});
