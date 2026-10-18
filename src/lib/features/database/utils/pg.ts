import { text, timestamp } from 'drizzle-orm/pg-core';

export const createdAt = timestamp('created_at', {
	withTimezone: true
})
	.notNull()
	.defaultNow();
export const updatedAt = timestamp({ withTimezone: true })
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date());
export const expiresAt = timestamp('expires_at', {
	withTimezone: true
})
	.notNull()
	.defaultNow();

export const betterAuthId = (idName = 'id') => text(idName).primaryKey();

export const timestamps = {
	createdAt,
	updatedAt
};
