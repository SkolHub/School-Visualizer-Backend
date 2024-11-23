import { integer, pgTable, serial, text, time } from 'drizzle-orm/pg-core';

export const timeSlot = pgTable('time_slot', {
  id: serial('id').primaryKey(),
  deviceToken: text('device_token').notNull(),
  name: text('name').notNull(),
  repeatAfter: integer('repeat_after').notNull(),
  time: time('time').notNull()
});
