import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

// Redirect if already authenticated
export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await locals.getUser();
	if (user) {
		throw redirect(307, '/app/');
	}
};
