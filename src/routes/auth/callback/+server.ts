import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const nextParam = url.searchParams.get('next') ?? '/app/';
	// Prevent open redirects: only allow same-site paths.
	const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/gateway';

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
