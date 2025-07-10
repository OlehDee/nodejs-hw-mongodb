import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

async function bootstrap() {
  await initMongoConnection();
  setupServer();
}

bootstrap();