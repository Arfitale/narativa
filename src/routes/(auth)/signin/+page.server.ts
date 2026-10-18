import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	google: async ({ locals, url }) => {
		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${url.origin}/auth/callback` }
		});
		if (error || !data.url) return fail(500, { message: 'Could not start Google sign-in.' });
		redirect(303, data.url);
	}
};

// export const actions: Actions = {
// 	signUpWithEmail: async ({ request }) => {
// 		const formData = await request.formData();
// 		const email = formData.get('email')?.toString();
// 		const password = formData.get('password')?.toString();

// 		if (!email || !password) {
// 			return fail(400, { message: 'All fields are required' });
// 		}

// 		try {
// 			// await auth.api.signUpEmail({
// 			// 	body: {
// 			// 		name: email.split('@')[0], // Use the part before '@' as a default name
// 			// 		email,
// 			// 		password
// 			// 	}
// 			// });
// 		} catch (err: any) {
// 			const message = err.message?.toLowerCase().includes('already exists')
// 				? 'This email is already registered. Please sign in instead.'
// 				: err.message || 'Failed to create account';

// 			return fail(400, { message });
// 		}
// 	}
// };
