import { Platform } from "react-native";
import * as Location from "expo-location";

export async function requestForegroundPermission() {
    return Location.requestForegroundPermissionsAsync();
}

export async function getForegroundPermission() {
    return Location.getForegroundPermissionsAsync();
}

export async function getUserLocation() {
    try {
        const perm = await Location.getForegroundPermissionsAsync();
        if (!perm.granted) return null;
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) return null;
        const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });
        return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch {
        return null;
    }
}

export async function geocodeAddress(address) {
    if (!address) return null;
    try {
        const results = await Location.geocodeAsync(address);
        if (!results?.length) return null;
        const { latitude, longitude } = results[0];
        return { latitude, longitude };
    } catch {
        return null;
    }
}

const toRad = (d) => (d * Math.PI) / 180;

/** Distance in km between two {latitude, longitude} points (haversine). */
export function distanceKm(a, b) {
    if (!a || !b) return null;
    const R = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return R * 2 * Math.asin(Math.sqrt(h));
}

/** Platform-correct deep link that opens turn-by-turn navigation to a point. */
export function navigationUrl({ latitude, longitude, label }) {
    const latlng = `${latitude},${longitude}`;
    if (Platform.OS === "ios") {
        return `http://maps.apple.com/?daddr=${latlng}${label ? `&q=${encodeURIComponent(label)}` : ""}`;
    }
    if (Platform.OS === "android") {
        return `google.navigation:q=${latlng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${latlng}`;
}
