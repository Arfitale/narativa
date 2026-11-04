import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
    const { error } = await locals.supabase.auth.signOut();

    if (error) {
        return json(
            { message: 'Could not sign out.' },
            { status: 500 }
        );
    }

    redirect(303, '/');
};