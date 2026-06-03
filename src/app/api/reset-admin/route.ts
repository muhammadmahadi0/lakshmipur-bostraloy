import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabase-server"

export async function GET() {
  return NextResponse.json({
    message: "Send a POST request to this endpoint to reset the admin password.",
    usage: {
      method: "POST",
      body: { password: "YourNewPassword (optional, defaults to Admin@123456)" },
    },
    default_email: process.env.ADMIN_EMAIL || "admin@lakshmipurbostraloy.com",
    example: `curl -X POST ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/reset-admin -H "Content-Type: application/json" -d '{"password": "MyNewPass123"}'`,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const newPassword = body.password || "Admin@123456"

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" },
        { status: 400 }
      )
    }

    const email = process.env.ADMIN_EMAIL || "admin@lakshmipurbostraloy.com"

    // Check if admin exists
    const { data: existing } = await supabaseAdmin()
      .from("admins")
      .select("id")
      .eq("email", email)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: "এডমিন ইউজার পাওয়া যায়নি। প্রথমে /api/seed কল করুন" },
        { status: 404 }
      )
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    const { error } = await supabaseAdmin()
      .from("admins")
      .update({ password_hash: passwordHash })
      .eq("email", email)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "পাসওয়ার্ড রিসেট হয়েছে",
      email,
      password: newPassword,
      warning: "প্রথম লগইনের পর পাসওয়ার্ড পরিবর্তন করুন!",
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
