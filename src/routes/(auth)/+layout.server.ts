import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/features/database/server/supabase-client';

// Redirect if already authenticated
export const load: LayoutServerLoad = async ({ locals }) => {
	const { data } = await supabase.from('countries').select();
	return {
		countries: data ?? []
	};
};
