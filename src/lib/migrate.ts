import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './db';

// This will run migrations
migrate(db, { migrationsFolder: './drizzle' });
