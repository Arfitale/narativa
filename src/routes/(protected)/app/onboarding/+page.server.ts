import { isUsernameExist } from '$lib/features/database/utils/fetcher';
import { getProfile, initializeProfile } from '$lib/features/database/utils/user-profiles';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export async function load({ locals }) {
	const user = await locals.getUser();

	if (!user) {
		return redirect(303, '/signin');
	}

	const profile = await getProfile(user.id);
	if (profile.isOnboarded) {
		return redirect(303, '/app/journey');
	}
	return { user };
}

export const actions: Actions = {
	onboardFinish: async ({ locals, request }) => {
		const user = await locals.getUser();

		if (!user) {
			return redirect(303, '/signin');
		}

		const formData = await request.formData();
		const displayName = formData.get('display-name') as string;
		const existing = await isUsernameExist(displayName);

		if (existing) {
			return fail(400, { error: 'Username is already taken. Please choose another name.' });
		}

		await initializeProfile({
			id: user.id,
			displayName: displayName,
			isOnboarded: true
		});

		return redirect(303, '/app');
	}
};
