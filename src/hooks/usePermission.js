import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";

export function usePermission({ request, get, deniedTitle, deniedMessage }) {
    const [status, setStatus] = useState(null);

    const ensure = useCallback(async () => {
        let current = get ? await get() : null;
        if (!current?.granted && (current?.canAskAgain ?? true)) {
            current = await request();
        }
        setStatus(current);

        if (current?.granted) return true;

        Alert.alert(
            deniedTitle ?? "Permissão necessária",
            deniedMessage ??
                "Ative a permissão nas configurações do aparelho para usar este recurso.",
            [
                { text: "Agora não", style: "cancel" },
                { text: "Abrir configurações", onPress: () => Linking.openSettings() },
            ]
        );
        return false;
    }, [request, get, deniedTitle, deniedMessage]);

    return { status, ensure };
}
