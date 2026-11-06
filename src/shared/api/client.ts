import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://lujrgasmxgehjmlbfjwz.supabase.co';
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_fwMJYNhw1gnvrKW-jOhaGQ_6Ik_epEg';

export const supabase = url && key && !url.includes('YOUR_PROJECT') ? createClient(url, key) : null;

export function client() {
  if (!supabase) throw new Error('Supabase не настроен');
  return supabase;
}
