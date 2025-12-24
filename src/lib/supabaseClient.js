// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Güvenlik: env yanlışsa konsola net uyarı verelim
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL veya VITE_SUPABASE_KEY tanımlı değil. .env.local dosyasını kontrol et."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
