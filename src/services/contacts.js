import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getContacts({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) {
  const skip = (page - 1) * perPage;
  const query = ContactsCollection.find();
  if (filter.contactType) {
    query.where('contactType').equals(filter.contactType);
  }
  if (typeof filter.isFavourite === 'boolean') {
    query.where('isFavourite').equals(filter.isFavourite);
  }

  const [totalItems, data] = await Promise.all([
    ContactsCollection.find().merge(query).countDocuments(),
    ContactsCollection.find()
      .merge(query)
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(totalItems, page, perPage);
  return {
    data,
    ...paginationData,
  };
}

export async function getContactById(contactId) {
  return await ContactsCollection.findById(contactId);
}

export async function createContact(payload) {
  return await ContactsCollection.create(payload);
}

export async function updateContact(contactId, payload, options = {}) {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
}

export async function deleteContact(contactId) {
  return await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
}