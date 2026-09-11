import { useCallback, useRef, useState } from "react";
import * as media from "../services/media";
import * as documents from "../services/documents";

let seq = 0;
const nextKey = () => `u${++seq}`;

export function useUploadQueue() {
    const [items, setItems] = useState([]);
    const itemsRef = useRef(items);
    itemsRef.current = items;
    const [busy, setBusy] = useState(false);

    const patch = useCallback((key, changes) => {
        setItems((list) =>
            list.map((it) => (it.key === key ? { ...it, ...changes } : it))
        );
    }, []);

    const addImages = useCallback((assets) => {
    setItems((list) => [
        ...list,
        ...assets.map((a) => ({
            key: nextKey(),
            kind: "image",
            name: a.fileName || a.name || "Foto",
            localUri: a.uri,
            mimeType: a.mimeType || "image/jpeg",
            size: a.fileSize || a.size || null,
            status: "pending",
            progress: 0,
            result: null,
            error: null,
        })),
    ]);
}, []);

    const addDocuments = useCallback((files) => {
        setItems((list) => [
            ...list,
            ...files.map((f) => ({
                key: nextKey(),
                kind: "doc",
                name: f.name,
                localUri: f.uri,
                mimeType: f.mimeType,
                size: f.size,
                status: "pending",
                progress: 0,
                result: null,
                error: null,
            })),
        ]);
    }, []);

    const remove = useCallback((key) => {
        setItems((list) => list.filter((it) => it.key !== key));
    }, []);

    const runOne = useCallback(
        async (item) => {
            patch(item.key, { status: "uploading", progress: 0, error: null });
            try {
                const onProgress = (p) => patch(item.key, { progress: p });
                const result =
                    item.kind === "image"
                        ? await media.upload(item.localUri, { onProgress })
                        : await documents.upload(
                              {
                                  uri: item.localUri,
                                  name: item.name,
                                  mimeType: item.mimeType,
                                  size: item.size,
                              },
                              { onProgress }
                          );
                patch(item.key, { status: "done", progress: 1, result });
                return { ok: true, item, result };
            } catch (e) {
                patch(item.key, { status: "error", error: e?.message ?? "falhou" });
                return { ok: false, item };
            }
        },
        [patch]
    );

    const retry = useCallback(
        (key) => {
            const item = itemsRef.current.find((it) => it.key === key);
            if (item) runOne(item);
        },
        [runOne]
    );

    const flush = useCallback(async () => {
    setBusy(true);

    try {
        const currentItems = itemsRef.current;

        const pending = currentItems.filter(
            (it) => it.status !== "done"
        );

        const processed = [];

        // Arquivos que já estavam enviados
        for (const item of currentItems) {
            if (item.status === "done" && item.result) {
                processed.push({
                    item,
                    result: item.result,
                });
            }
        }

        // Envia os que ainda estão pendentes
        for (const item of pending) {
            const response = await runOne(item);

            if (!response.ok) {
                continue;
            }

            processed.push({
                item,
                result: response.result,
            });
        }

        const failed = pending.filter(
            (item) => {
                const wasProcessed = processed.some(
                    (p) => p.item.key === item.key
                );

                return !wasProcessed;
            }
        );

        if (failed.length) {
            const err = new Error(
                `${failed.length} anexo(s) não foram enviados.`
            );

            err.failedKeys = failed.map((f) => f.key);

            throw err;
        }

        return {
            images: processed
                .filter(({ item }) => item.kind === "image")
                .map(({ result }) => result),

            attachments: processed
                .filter(({ item }) => item.kind === "doc")
                .map(({ result }) => result),
        };
    } finally {
        setBusy(false);
    }
}, [runOne]);

    return { items, busy, addImages, addDocuments, remove, retry, flush };
}
