import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { Header } from "../components/header";
import { ImageCarousel } from "../components/ImageCarousel";
import { AttachmentList } from "../components/AttachmentList";
import { useRecord } from "../hooks/useCollection";
import { announcementsStore } from "../mocks";

export function SpecificPostPage() {
    const { params } = useRoute();
    const { data: post, loading } = useRecord(announcementsStore, params?.id);

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <Text style={styles.title}>Comunicado</Text>
            </View>

            {loading ? (
                <ActivityIndicator color="#FE5F2F" style={{ marginTop: 40 }} />
            ) : !post ? (
                <Text style={styles.notFound}>Comunicado não encontrado.</Text>
            ) : (
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{post.title}</Text>
                        </View>
                        <View style={styles.separator} />

                        <Text style={styles.cardInfo}>
                            <Text style={styles.cardTopic}>Autor: </Text>
                            {post.author}
                        </Text>
                        {post.date ? (
                            <Text style={styles.cardInfo}>
                                <Text style={styles.cardTopic}>Data: </Text>
                                {format(new Date(post.date), "dd/MM/yyyy 'às' HH:mm")}
                            </Text>
                        ) : null}

                        {post.images?.length ? (
                            <View style={styles.media}>
                                <ImageCarousel images={post.images} />
                            </View>
                        ) : null}

                        <View style={styles.postContent}>
                            <Text style={styles.cardInfo}>{post.content}</Text>
                        </View>

                        {post.attachments?.length ? (
                            <>
                                <Text style={styles.sectionLabel}>Anexos</Text>
                                <AttachmentList attachments={post.attachments} />
                            </>
                        ) : null}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0F0F0F",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flex: 1,
    },
    header: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    title: { color: "white", fontSize: 28, fontWeight: "600" },
    scroll: { paddingHorizontal: 20, paddingBottom: 40, alignItems: "center" },
    card: {
        backgroundColor: "#1C1C1C",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#9CA3AF",
        marginBottom: 20,
        width: "100%",
    },
    separator: { height: 1, backgroundColor: "#9CA3AF", marginVertical: 12 },
    cardHeader: { marginBottom: 10 },
    cardTitle: { color: "white", fontSize: 20, fontWeight: "600" },
    cardTopic: { color: "#fe5f2f", fontWeight: "700" },
    cardInfo: { color: "white", fontSize: 14, marginBottom: 4 },
    media: { marginTop: 16 },
    postContent: { marginTop: 20 },
    sectionLabel: {
        color: "#FE5F2F",
        fontWeight: "700",
        fontSize: 14,
        marginTop: 20,
    },
    notFound: { color: "#9CA3AF", textAlign: "center", marginTop: 40 },
});
