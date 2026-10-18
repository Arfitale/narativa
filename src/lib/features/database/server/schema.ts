import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import { timestamps } from '../utils/pg';

export const profiles = pgTable('profiles', {
	id: uuid()
		.primaryKey()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	displayName: text().notNull(),
	...timestamps
}).enableRLS();
