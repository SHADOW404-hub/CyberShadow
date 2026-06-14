import { createClient } from '@supabase/supabase-js';

// Environment variables orqali xavfsiz ulanish
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
const supabaseServiceKey = (import.meta.env.VITE_SUPABASE_SERVICE_KEY as string) || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client - RLS ni bypass qiladi (faqat admin panelda ishlatiladi)
// auth opsiyalari to'liq o'chirilgan — "Multiple GoTrueClient instances" ogohlantirishidan qochish uchun
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : supabase; // Fallback: agar service key yo'q bo'lsa, oddiy clientni ishlatadi

// Ma'lumotlar bazasi jadvallari uchun helperlar
export const db = {
  profiles: () => supabase.from('profiles'),
  challenges: () => supabase.from('challenges'),
};
