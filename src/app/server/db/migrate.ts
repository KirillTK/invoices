import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, conn } from './index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsFolderPath = path.resolve(__dirname, './migrations');

await migrate(db, { migrationsFolder: migrationsFolderPath });

await conn.end();