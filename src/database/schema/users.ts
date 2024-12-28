import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  deviceToken: text('device_token').primaryKey(),
  startToken: text('start_token').notNull(),
  updateToken: text('update_token').notNull(),
  pauseUntil: timestamp({ mode: 'date' }),
  isLive: boolean('is_live').notNull().default(false)
});
