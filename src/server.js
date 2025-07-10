import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

export function setupServer() {
  const app = express();
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors());

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    if (contacts.length === 0) {
      res.status(404).json({
        status: 404,
        message: 'Contacts not found',
        error: 'Looks like the database of contacts is empty',
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        status: 404,
        message: 'Contact not found',
        error: `The requested contact with id ${contactId} was not found`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res, next) => {
    res.status(404).json({
      status: 404,
      message: 'Not found',
      error: `The requested resource ${req.url} was not found`,
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      error: error.message,
    });
  });

  const PORT = Number(env('PORT', 3000));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}