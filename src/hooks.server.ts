// src/hooks.server.ts
import { auth } from '$lib/features/auth/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Fetch current session from Better Auth using request headers
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	// 2. Populate locals
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	} else {
		event.locals.session = null;
		event.locals.user = null;
	}

	// 3. Let Better Auth handle /api/auth routes
	return svelteKitHandler({ event, resolve, auth, building });
};
