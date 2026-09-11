import { useCallback, useEffect, useState } from "react";

export function useCollection(store) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        try {
            setError(null);
            const list = await store.list();
            setData(list);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [store]);

    useEffect(() => {
        refresh();
        const unsub = store.subscribe(() => refresh());
        return unsub;
    }, [store, refresh]);

    return { data, loading, error, refresh };
}

export function useRecord(store, id) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        try {
            setError(null);
            setData(await store.getById(id));
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [store, id]);

    useEffect(() => {
        refresh();
        const unsub = store.subscribe(() => refresh());
        return unsub;
    }, [store, refresh]);

    return { data, loading, error, refresh };
}
