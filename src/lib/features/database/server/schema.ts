export * from './auth.schema';
import { betterAuthId, createdAt, updatedAt } from '$lib/utils/server/db/pg';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';
import { relations } from 'drizzle-orm';

/* ============================================================
 * Narativa
 * ============================================================ */

export const profile = pgTable('profile', {
	id: betterAuthId('profile_id'),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, {
			onDelete: 'cascade'
		}),
	username: text('username').notNull().unique(),
	bio: text('bio'),
	avatarUrl: text('avatar_url'),
	level: integer('level').default(1),
	xp: integer('xp').default(0),
	createdAt: createdAt,
	updatedAt: updatedAt
});

export const userRelations = relations(user, ({ one }) => ({
	profile: one(profile, {
		fields: [user.id],
		references: [profile.userId]
	})
}));

export const profileRelations = relations(profile, ({ one }) => ({
	user: one(user, {
		fields: [profile.userId],
		references: [user.id]
	})
}));
