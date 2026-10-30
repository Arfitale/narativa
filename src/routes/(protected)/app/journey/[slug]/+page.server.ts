import type { PageServerLoad } from './\$types';
import { getNodeBySlug, isNodeUnlocked } from '$lib/features/database/utils/fetcher';
import { error, isHttpError, isRedirect, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const user = await locals.getUser();

		if (!user) {
			redirect(302, '/login');
		}

		const node = await getNodeBySlug(params.slug);
		if (!node) {
			throw error(404, 'Node not found');
		}

		if (!(await isNodeUnlocked(user.id, node.id))) {
			redirect(302, '/app/journey');
		}

		return {
			node
		};
	} catch (err: any) {
		if (isRedirect(err) || isHttpError(err)) {
			throw err;
		}
	}
};
