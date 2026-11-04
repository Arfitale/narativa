import type { PageServerLoad } from './\$types';
import { getLearningTrack, getProgressionTrack } from '$lib/features/database/utils/fetcher';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = await locals.getUser();

	if (!user) {
		redirect(303, "/signin")
	}

	try {
		const learningTracks = await getLearningTrack('main');
		const progression = await getProgressionTrack(user.id);
		return {
			learningTracks,
			progression
		};
	} catch (err: any) {
		console.log(err);
	}
};
