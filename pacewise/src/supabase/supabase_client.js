import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://flnpmhyvetzssnpsylit.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbnBtaHl2ZXR6c3NucHN5bGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTE1NDQsImV4cCI6MjA3NjEyNzU0NH0.7MO3cyUVTxX0tPWGtuLvhimnsa5zSTAs3kXri1Gn2s8";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;