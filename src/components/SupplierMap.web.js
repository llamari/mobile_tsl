import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STORE_LOCATION = { latitude: -23.5893, longitude: -46.6412 };

function buildStaticMapUrl(center) {
    const latitudeDelta = center?.latitudeDelta ?? 0.08;
    const longitudeDelta = center?.longitudeDelta ?? 0.08;

    const zoom = Math.max(
        9,
        Math.min(
            16,
            Math.round(15 - Math.log2(Math.max(latitudeDelta, longitudeDelta) / 0.01))
        )
    );

    return `https://staticmap.openstreetmap.de/staticmap.php?center=${center.latitude},${center.longitude}&zoom=${zoom}&size=900x600&maptype=mapnik`;
}

function resolveCenter({ suppliers, userLocation, region }) {
    if (region) return region;

    const validSuppliers = suppliers.filter(
        (supplier) => supplier.latitude != null && supplier.longitude != null
    );

    if (validSuppliers.length > 0) {
        const latitudes = validSuppliers.map((supplier) => supplier.latitude);
        const longitudes = validSuppliers.map((supplier) => supplier.longitude);

        return {
            latitude: latitudes.reduce((sum, value) => sum + value, 0) / latitudes.length,
            longitude:
                longitudes.reduce((sum, value) => sum + value, 0) / longitudes.length,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
        };
    }

    if (userLocation) {
        return {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
        };
    }

    return {
        ...STORE_LOCATION,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    };
}

export function SupplierMap({
    suppliers = [],
    userLocation = null,
    selectedId = null,
    onSelect,
    style,
    region,
}) {
    const center = resolveCenter({ suppliers, userLocation, region });
    const visibleSuppliers = suppliers.filter(
        (supplier) => supplier.latitude != null && supplier.longitude != null
    );

    return (
        <View style={[styles.container, style]}>
            <Image
                source={{ uri: buildStaticMapUrl(center) }}
                style={styles.mapImage}
                resizeMode="cover"
            />

            {userLocation && (
                <View
                    pointerEvents="none"
                    style={[
                        styles.userMarker,
                        {
                            left: `${Math.min(100, Math.max(0, ((userLocation.longitude - center.longitude) / (center.longitudeDelta || 0.08)) * 100 + 50))}%`,
                            top: `${Math.min(100, Math.max(0, 50 - ((userLocation.latitude - center.latitude) / (center.latitudeDelta || 0.08)) * 100))}%`,
                        },
                    ]}
                />
            )}

            {visibleSuppliers.map((supplier) => {
                const left =
                    ((supplier.longitude - center.longitude) /
                        (center.longitudeDelta || 0.08)) *
                        100 +
                    50;
                const top =
                    50 -
                    ((supplier.latitude - center.latitude) /
                        (center.latitudeDelta || 0.08)) *
                        100;

                return (
                    <TouchableOpacity
                        key={supplier.id}
                        activeOpacity={0.8}
                        style={[
                            styles.marker,
                            supplier.id === selectedId && styles.markerSelected,
                            {
                                left: `${Math.min(90, Math.max(10, left))}%`,
                                top: `${Math.min(90, Math.max(10, top))}%`,
                            },
                        ]}
                        onPress={() => onSelect?.(supplier)}
                    >
                        <Text style={styles.markerText}>•</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#111827",
        borderRadius: 12,
        overflow: "hidden",
        flex: 1,
        minHeight: 160,
        position: "relative",
    },
    mapImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    userMarker: {
        position: "absolute",
        width: 14,
        height: 14,
        borderRadius: 999,
        backgroundColor: "#2563EB",
        borderWidth: 2,
        borderColor: "#E0F2FE",
        transform: [{ translateX: -7 }, { translateY: -7 }],
        zIndex: 2,
    },
    marker: {
        position: "absolute",
        width: 18,
        height: 18,
        borderRadius: 999,
        backgroundColor: "#A20202",
        borderWidth: 2,
        borderColor: "#F9FAFB",
        alignItems: "center",
        justifyContent: "center",
        transform: [{ translateX: -9 }, { translateY: -9 }],
        zIndex: 3,
    },
    markerSelected: {
        backgroundColor: "#FE5F2F",
        width: 20,
        height: 20,
        transform: [{ translateX: -10 }, { translateY: -10 }],
    },
    markerText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        lineHeight: 12,
        marginTop: -1,
    },
});

export { STORE_LOCATION };
