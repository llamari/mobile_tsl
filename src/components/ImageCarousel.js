import { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { X } from "lucide-react-native";

const { width: SCREEN_W } = Dimensions.get("window");

/**
 * Read-only image carousel for an announcement. `images` is [{ id, url }].
 * Tapping an image opens a fullscreen pager.
 */
export function ImageCarousel({ images = [] }) {
    const [viewerIndex, setViewerIndex] = useState(null);

    if (!images.length) return null;

    return (
        <>
            <FlatList
                data={images}
                keyExtractor={(img) => img?.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <Pressable onPress={() => setViewerIndex(index)}>
                        <Image source={{ uri: item?.url }} style={styles.slide} />
                    </Pressable>
                )}
            />
            {images.length > 1 && (
                <Text style={styles.count}>{images.length} fotos</Text>
            )}

            <Modal
                visible={viewerIndex !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setViewerIndex(null)}
            >
                <View style={styles.viewer}>
                    <Pressable
                        style={styles.close}
                        onPress={() => setViewerIndex(null)}
                        hitSlop={12}
                    >
                        <X color="white" size={28} />
                    </Pressable>
                    <FlatList
                        data={images}
                        keyExtractor={(img) => img?.id}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={viewerIndex ?? 0}
                        getItemLayout={(_, i) => ({
                            length: SCREEN_W,
                            offset: SCREEN_W * i,
                            index: i,
                        })}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item?.url }}
                                style={styles.fullImage}
                                resizeMode="contain"
                            />
                        )}
                    />
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    slide: {
        width: SCREEN_W - 72,
        height: 200,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: "#1C1C1C",
    },
    count: { color: "#9CA3AF", fontSize: 12, marginTop: 6 },
    viewer: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center" },
    close: { position: "absolute", top: 48, right: 20, zIndex: 2 },
    fullImage: { width: SCREEN_W, height: "100%" },
});
