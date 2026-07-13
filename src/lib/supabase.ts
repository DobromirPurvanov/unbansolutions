import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ключовете идват от Vercel env при build (както reCAPTCHA).
// Publishable ключът е публичен по дизайн – Row Level Security в базата
// е истинската ключалка, не тайната на този ключ.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && key);

// null вместо срив: ако env липсва, сайтът работи, а порталните страници
// показват съобщение, вместо целият сайт да падне (наученото от reCAPTCHA).
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url!, key!)
  : null;
