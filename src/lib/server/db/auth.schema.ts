import { betterAuthId, createdAt, expiresAt, updatedAt } from '$lib/utils/server/db/pg';
import { pgTable, text, timestamp, boolean, uuid, primaryKey } from 'drizzle-orm/pg-core';

/* ============================================================
 * Better Auth
 * ============================================================ */

export const user = pgTable('user', {
	id: betterAuthId('user_id'),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	emailVerified: boolean('email_verified').notNull().default(false),
	image: text('image'),
	createdAt: createdAt,
	updatedAt: updatedAt
});

export const session = pgTable('session', {
	id: betterAuthId('session_id'),
	token: text('token').notNull().unique(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, {
			onDelete: 'cascade'
		}),
	expiresAt: expiresAt,

	// Optional
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),

	createdAt: createdAt,
	updatedAt: updatedAt
});

export const account = pgTable('account', {
	id: betterAuthId('id'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, {
			onDelete: 'cascade'
		}),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at', {
		withTimezone: true
	}),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
		withTimezone: true
	}),
	scope: text('scope'),
	idToken: text('id_token'),
	password: text('password'),
	createdAt: createdAt,
	updatedAt: updatedAt
});

export const verification = pgTable('verification', {
	id: betterAuthId('verification_id'),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: expiresAt,
	createdAt: createdAt
});
