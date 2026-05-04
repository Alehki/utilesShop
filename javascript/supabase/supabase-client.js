const SUPABASE_URL = "https://jtumqhpuegqzmkgeofxw.supabase.co";
const SUPABASE_KEY = "sb_publishable_7a6K3_VDHdqvyQhnj-0Cag_uyH7MlFw";

export const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);