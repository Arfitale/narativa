import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/features/database/server';
import { profiles } from '$lib/features/database/server/schema';
// import { db } from '$lib/server/db';  // your Drizzle client
// import { profiles } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const nextParam = url.searchParams.get('next') ?? '/app/';
	// Prevent open redirects: only allow same-site paths.
	const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/app/';

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const user = await locals.getUser();
			if (user) {
			}
			redirect(303, next);
		}
	}
	redirect(303, '/login?error=auth');
};
