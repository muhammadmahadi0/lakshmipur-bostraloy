"use server"

import { verifyAdmin, setAuthCookie } from "@/lib/auth"

export async function verifyAdminAction(email: string, password: string) {
  try {
    const token = await verifyAdmin(email, password)
    if (!token) {
      return { success: false, error: "ইমেইল বা পাসওয়ার্ড ভুল" }
    }
    await setAuthCookie(token)
    return { success: true }
  } catch {
    return { success: false, error: "লগইন ব্যর্থ হয়েছে" }
  }
}
