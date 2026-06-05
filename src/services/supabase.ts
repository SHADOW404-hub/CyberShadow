import { createClient } from '@supabase/supabase-js';

// Environment variables orqali xavfsiz ulanish
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Ma'lumotlar bazasi jadvallari uchun helperlar
export const db = {
  profiles: () => supabase.from('profiles'),
  challenges: () => supabase.from('challenges'),
};
