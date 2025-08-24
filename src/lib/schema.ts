import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const householdMembers = sqliteTable('household_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'dad', 'mom', 'child', 'grandparent', 'family_member', 'roommate', 'other'
  photo: text('photo'), // Base64 encoded image or file path
  dateOfBirth: text('date_of_birth'), // ISO date string
  sex: text('sex').notNull(), // 'male', 'female', 'other'
  height: real('height'), // in inches (calculated from feet + inches)
  weight: real('weight'), // in pounds
  activityLevel: text('activity_level').notNull(), // 'sedentary', 'light', 'moderate', 'active', 'very_active'
  allergens: text('allergens'), // JSON array of strings
  exclusions: text('exclusions'), // JSON array of strings
  likes: text('likes'), // JSON array of strings  
  dislikes: text('dislikes'), // JSON array of strings
  medications: text('medications'), // JSON array of strings
  incomeSources: text('income_sources'), // JSON array of objects with source, amount, and frequency
  medicalNotes: text('medical_notes'), // Optional field
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`).notNull(),
});

export type HouseholdMember = typeof householdMembers.$inferSelect;
export type NewHouseholdMember = typeof householdMembers.$inferInsert;
