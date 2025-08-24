import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { householdMembers } from './schema';

const sqlite = new Database('./sqlite.db');
export const db = drizzle(sqlite, { schema: { householdMembers } });
