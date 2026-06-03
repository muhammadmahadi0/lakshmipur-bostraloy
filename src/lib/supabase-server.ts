import { createClient } from "@supabase/supabase-js"

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase environment variables not configured")
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

let _admin: ReturnType<typeof getSupabaseAdmin> | null = null

export function supabaseAdmin() {
  if (!_admin) _admin = getSupabaseAdmin()
  return _admin
}
