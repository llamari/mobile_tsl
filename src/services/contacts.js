import * as Contacts from "expo-contacts";

export async function requestPermission() {
    return Contacts.requestPermissionsAsync();
}

export async function getPermission() {
    return Contacts.getPermissionsAsync();
}

export async function pickContact() {
    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) return null;
    return {
        name: contact.name ?? "",
        phone: contact.phoneNumbers?.[0]?.number ?? "",
        email: contact.emails?.[0]?.email ?? "",
        address: formatAddress(contact.addresses?.[0]),
    };
}

function formatAddress(a) {
    if (!a) return "";
    return [a.street, a.city, a.region, a.postalCode]
        .filter(Boolean)
        .join(", ");
}

export async function saveSupplierAsContact(supplier) {
    const contact = {
        [Contacts.Fields.FirstName]: supplier.name,
        [Contacts.Fields.Company]: "Fornecedor - TSL",
        [Contacts.Fields.ContactType]: Contacts.ContactTypes.Company,
    };
    if (supplier.phone) {
        contact[Contacts.Fields.PhoneNumbers] = [
            { label: "work", number: supplier.phone },
        ];
    }
    if (supplier.email) {
        contact[Contacts.Fields.Emails] = [
            { label: "work", email: supplier.email },
        ];
    }
    if (supplier.address) {
        contact[Contacts.Fields.Addresses] = [
            { label: "work", street: supplier.address },
        ];
    }
    return Contacts.addContactAsync(contact);
}
