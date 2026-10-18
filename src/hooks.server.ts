import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) =>
				cookiesToSet.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				)
		}
	});

	// getClaims() verifies the JWT. Never trust getSession() for authorization on the server.
	event.locals.getUser = async () => {
		const { data, error } = await event.locals.supabase.auth.getClaims();
		if (error || !data?.claims) return null;
		const c = data.claims;
		return {
			id: c.sub,
			email: c.email ?? null,
			name: (c.user_metadata?.full_name as string | undefined) ?? null
		};
	};

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
};
