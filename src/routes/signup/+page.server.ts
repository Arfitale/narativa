import { auth } from '$lib/server/auth/auth';
import { fail, redirect, type ActionFailure, type ActionResult } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';

// Redirect if already authenticated
export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	// 1. Email/Password Sign Up Action
	signUpWithEmail: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { message: 'All fields are required' });
		}

		try {
			await auth.api.signUpEmail({
				body: {
					name: email.split('@')[0], // Use the part before '@' as a default name
					email,
					password
				}
			});
		} catch (err: any) {
			const message = err.message?.toLowerCase().includes('already exists')
				? 'This email is already registered. Please sign in instead.'
				: err.message || 'Failed to create account';

			return fail(400, { message });
		}
	}

	// 2. Email/Password Sign In Action
	// signInWithEmail: async ({ request }) => {
	// 	const formData = await request.formData();
	// 	const email = formData.get('email')?.toString();
	// 	const password = formData.get('password')?.toString();

	// 	if (!email || !password) {
	// 		return fail(400, { message: 'Email and password required' });
	// 	}

	// 	try {
	// 		await auth.api.signInEmail({
	// 			body: {
	// 				email,
	// 				password
	// 			}
	// 		});
	// 	} catch (err: any) {
	// 		return fail(400, { message: err.message || 'Invalid credentials' });
	// 	}

	// 	throw redirect(302, '/');
	// },

	// // 3. Initiate Google OAuth Flow Action
	// signInWithGoogle: async () => {
	// 	const res = await auth.api.signInSocial({
	// 		body: {
	// 			provider: 'google',
	// 			callbackURL: '/'
	// 		}
	// 	});

	// 	if (res?.url) {
	// 		throw redirect(302, res.url);
	// 	}

	// 	return fail(500, { message: 'Failed to initialize Google login' });
	// }
};
