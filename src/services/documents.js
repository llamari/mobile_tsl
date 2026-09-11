import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";

const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function pickDocuments() {
    const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
        type: ALLOWED_TYPES,
    });
    if (result.canceled) return { files: [], rejected: [] };

    const files = [];
    const rejected = [];
    for (const a of result.assets) {
        if (a.size && a.size > MAX_BYTES) {
            rejected.push({ name: a.name, reason: "maior que 10 MB" });
            continue;
        }
        files.push({
            uri: a.uri,
            name: a.name,
            mimeType: a.mimeType ?? "application/octet-stream",
            size: a.size ?? null,
        });
    }
    return { files, rejected };
}

export async function upload(file, { onProgress } = {}) {
    for (let p = 0.25; p < 1; p += 0.25) {
        await new Promise((r) => setTimeout(r, 100));
        onProgress?.(p);
    }
    onProgress?.(1);
    return {
        id: `doc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        url: file.uri,
    };
}

export async function openDocument(attachment) {
    const { url, mimeType } = attachment;
    const isRemote = /^https?:/.test(url);

    if (isRemote && (mimeType === "application/pdf" || mimeType?.startsWith("image/"))) {
        await WebBrowser.openBrowserAsync(url);
        return;
    }
    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(url, { mimeType, dialogTitle: attachment.name });
        return;
    }
    await WebBrowser.openBrowserAsync(url);
}

export function formatBytes(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
