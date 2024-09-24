import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, conn } from './index';

await migrate(db, { migrationsFolder: './drizzle/migrations' });

await conn.end();