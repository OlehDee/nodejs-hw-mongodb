import { ContactsCollection } from '../db/models/contacts.js';

export async function getAllContacts() {
  const contacts = await ContactsCollection.find({});
  return contacts;
}

export async function getContactById(contactId) {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
}