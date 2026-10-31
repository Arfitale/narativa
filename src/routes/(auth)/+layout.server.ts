import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Redirect if already authenticated
export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await locals.getUser();
	if (user) {
		throw redirect(307, '/app/');
	}
};
