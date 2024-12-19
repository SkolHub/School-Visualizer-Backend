import { pgTable, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  deviceToken: text('device_token').primaryKey(),
  startToken: text('start_token').notNull(),
  updateToken: text('update_token').notNull()
});
