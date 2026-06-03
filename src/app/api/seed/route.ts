import { supabaseAdmin } from "@/lib/supabase-server"
import { createAdmin } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@lakshmipurbostraloy.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456"

    // Check if admin exists
    const { data: existing } = await supabaseAdmin()
      .from("admins")
      .select("id")
      .eq("email", adminEmail)
      .single()

    if (existing) {
      return NextResponse.json({ message: "Admin already exists", email: adminEmail })
    }

    await createAdmin(adminEmail, adminPassword)

    return NextResponse.json({
      message: "Admin created successfully",
      email: adminEmail,
      warning: "Change the default password after first login!",
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
