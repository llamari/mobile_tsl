import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const MAX_DIMENSION = 1600;
const COMPRESS_QUALITY = 0.6;

export async function requestCameraPermission() {
    return ImagePicker.requestCameraPermissionsAsync();
}
export async function getCameraPermission() {
    return ImagePicker.getCameraPermissionsAsync();
}
export async function requestLibraryPermission() {
    return ImagePicker.requestMediaLibraryPermissionsAsync();
}
export async function getLibraryPermission() {
    return ImagePicker.getMediaLibraryPermissionsAsync();
}

export async function takePhoto() {
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
    });
    return normalize(result);
}

export async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 8,
        quality: 1,
    });
    return normalize(result);
}

function normalize(result) {
    if (result.canceled) return [];
    return result.assets.map((a) => ({ uri: a.uri, width: a.width, height: a.height }));
}

export async function compressImage(uri) {
    try {
        const out = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: MAX_DIMENSION } }],
            { compress: COMPRESS_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
        );
        return out.uri;
    } catch {
        return uri; 
    }
}

export async function upload(localUri, { onProgress } = {}) {
    const compressed = await compressImage(localUri);
    for (let p = 0.2; p < 1; p += 0.2) {
        await new Promise((r) => setTimeout(r, 120));
        onProgress?.(p);
    }
    onProgress?.(1);
    return {
        id: `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        url: compressed,
    };
}
