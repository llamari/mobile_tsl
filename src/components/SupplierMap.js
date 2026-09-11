import { Platform, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

/**
 * Native map (iOS/Android). Metro resolves SupplierMap.web.js for the web build,
 * so react-native-maps is never bundled there.
 */

const STORE_LOCATION = { latitude: -23.5893, longitude: -46.6412 };

export function SupplierMap({
    suppliers = [],
    userLocation = null,
    selectedId = null,
    onSelect,
    style,
    region,
}) {
    const initialRegion = region ?? {
        latitude: userLocation?.latitude ?? STORE_LOCATION.latitude,
        longitude: userLocation?.longitude ?? STORE_LOCATION.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    };

    return (
        <MapView
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            style={[styles.map, style]}
            initialRegion={initialRegion}
            showsUserLocation={!!userLocation}
            showsMyLocationButton={false}
        >
            {suppliers
                .filter((s) => s.latitude != null && s.longitude != null)
                .map((s) => (
                    <Marker
                        key={s.id}
                        coordinate={{ latitude: s.latitude, longitude: s.longitude }}
                        title={s.name}
                        description={s.category}
                        pinColor={s.id === selectedId ? "#FE5F2F" : "#A20202"}
                        onCalloutPress={() => onSelect?.(s)}
                        onPress={() => onSelect?.(s)}
                    />
                ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: { width: "100%", height: "100%" },
});

export { STORE_LOCATION };
