import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_PREFIX = "@tsl_mock/";
const LATENCY_MS = 350; 

const delay = (ms = LATENCY_MS) => new Promise((r) => setTimeout(r, ms));

const genId = (prefix) =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function createCollection(name, seed) {
    const key = STORAGE_PREFIX + name;
    let items = null; 
    const listeners = new Set();

    async function load() {
        if (items) return items;
        try {
            const raw = await AsyncStorage.getItem(key);
            if (raw) {
                items = JSON.parse(raw);
            } else {
                items = seed.map((s) => ({ ...s }));
                await persist();
            }
        } catch (e) {
            console.warn(`[mock:${name}] load failed, using seed`, e);
            items = seed.map((s) => ({ ...s }));
        }
        return items;
    }

    async function persist() {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(items));
        } catch (e) {
            console.warn(`[mock:${name}] persist failed`, e);
        }
        listeners.forEach((fn) => fn(items));
    }

    return {
        subscribe(fn) {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },

        async list() {
            await delay();
            const all = await load();
            return all.map((i) => ({ ...i }));
        },

        async getById(id) {
            await delay();
            const all = await load();
            const found = all.find((i) => String(i.id) === String(id));
            return found ? { ...found } : null;
        },

        async create(data) {
            await delay();
            await load();
            const record = {
                id: genId(name.slice(0, 3)),
                createdAt: new Date().toISOString(),
                ...data,
            };
            items = [record, ...items];
            await persist();
            return { ...record };
        },

        async update(id, patch) {
            await delay();
            await load();
            items = items.map((i) =>
                String(i.id) === String(id) ? { ...i, ...patch } : i
            );
            await persist();
            const updated = items.find((i) => String(i.id) === String(id));
            return updated ? { ...updated } : null;
        },

        async remove(id) {
            await delay();
            await load();
            items = items.filter((i) => String(i.id) !== String(id));
            await persist();
        },

        async reset() {
            items = null;
            await AsyncStorage.removeItem(key);
            await load();
            listeners.forEach((fn) => fn(items));
        },
    };
}
