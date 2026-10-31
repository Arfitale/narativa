import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, url }) => {
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		const { error } = await supabase.auth.signOut();
		throw redirect(303, `/signin`);
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select()
		.eq('id', user.id)
		.maybeSingle();

	if (!profile?.is_onboarded && url.pathname !== '/app/onboarding') {
		throw redirect(303, '/app/onboarding');
	}

	return {
		session,
		user,
		profile
	};
};
