// Location: src/supabase/supabase_client.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client (no TypeScript generics)
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
