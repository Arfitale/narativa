import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "$env/static/public"
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseKey);