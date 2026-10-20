import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
export const products = pgTable('products', { id: text().primaryKey(), data: jsonb().notNull() });
export const preferences = pgTable('preferences', { userId: text('user_id').primaryKey(), data: jsonb().notNull() });
export const events = pgTable('events', { id: text().primaryKey(), userId: text('user_id'), kind: text().notNull(), data: jsonb().notNull(), createdAt: timestamp('created_at').defaultNow() });
export const settings = pgTable('settings', { id: text().primaryKey(), data: jsonb().notNull() });
