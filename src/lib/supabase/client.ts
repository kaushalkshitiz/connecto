// =============================================================================
// Athlete Risk Intelligence Platform
// Supabase Browser Client Helper
// =============================================================================

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client proxy or log warning if running in local demo mode without env vars
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
