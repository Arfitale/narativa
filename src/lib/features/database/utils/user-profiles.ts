import { eq } from 'drizzle-orm';
import { db } from '$lib/features/database/server/index';
import { profiles, type NewProfile } from '$lib/features/database/schema/schema';
import { fail } from '@sveltejs/kit';

export async function getProfile(userId: string) {
	const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
	return profile;
}

export async function isUsernameExist(name: string) {
	const [existing] = await db
		.select()
		.from(profiles)
		.where(eq(profiles.displayName, name))
		.limit(1);
	if (existing) {
		return true;
	}
	return false;
}

export async function initializeProfile(profile: NewProfile) {
	try {
		await db.insert(profiles).values(profile);
		return { success: true };
	} catch (error) {
		console.log(error);
		return fail(500, { error: 'Something went wrong on server' });
	}
}
