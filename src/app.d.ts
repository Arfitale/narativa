import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getUser: () => Promise<{ id: string; email: string | null; name: string | null } | null>;
		}
	}
}
export {};
