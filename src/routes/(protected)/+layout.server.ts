import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getProfile } from '$lib/features/database/utils/user-profiles';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, url }) => {
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		const { error } = await supabase.auth.signOut();
		throw redirect(303, `/signin`);
	}

	const profile = await getProfile(user.id);
	if (!profile.isOnboarded && url.pathname !== '/app/onboarding') {
		throw redirect(303, '/app/onboarding');
	}

	return {
		session,
		user,
		profile
	};
};
