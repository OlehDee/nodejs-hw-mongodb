import { contactTypesList } from '../constants/contacts.js';

const parseType = (contactType) => {
  if (typeof contactType !== 'string') return;
  if (contactTypesList.includes(contactType)) return contactType;
};

function parseBoolean(value) {
  if (typeof value !== 'string') return;
  if (value === '1' || value.toLowerCase() === 'true') {
    return true;
  } else if (value === '0' || value.toLowerCase() === 'false') {
    return false;
  } else {
    return;
  }
}

export function parseContactFilterParams(queryParams) {
  const { isFavourite, contactType } = queryParams;
  return {
    isFavourite: parseBoolean(isFavourite),
    contactType: parseType(contactType),
  };
}