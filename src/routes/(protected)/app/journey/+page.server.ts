import type { PageServerLoad } from './\$types';
import { getLearningTrack } from '$lib/features/database/utils/fetcher';

export const load: PageServerLoad = async () => {
	try {
		const learningTracks = await getLearningTrack('main');
		return {
			learningTracks
		};
	} catch (err: any) {
		console.log(err);
	}
};
