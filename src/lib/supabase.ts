import { createClient } from "@supabase/supabase-js"

let _client: ReturnType<typeof createClient> | null = null

export function supabase() {
  if (_client) return _client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables not configured")
  }

  _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}
