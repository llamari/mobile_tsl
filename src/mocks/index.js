import { createCollection } from "./store";
import announcementsSeed from "./seed/announcements.json";
import suppliersSeed from "./seed/suppliers.json";

export const announcementsStore = createCollection("announcements", announcementsSeed);
export const suppliersStore = createCollection("suppliers", suppliersSeed);
