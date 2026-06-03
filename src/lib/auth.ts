"use server"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { supabaseAdmin } from "./supabase-server"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production"
const COOKIE_NAME = "admin_token"

export async function verifyAdmin(email: string, password: string) {
  const { data } = await supabaseAdmin()
    .from("admins")
    .select("*")
    .eq("email", email)
    .single()

  if (!data) return null

  const valid = await bcrypt.compare(password, data.password_hash)
  if (!valid) return null

  const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: "7d" })
  return token
}

export async function createAdmin(email: string, password: string) {
  const hash = await bcrypt.hash(password, 10)
  const { data, error } = await supabaseAdmin()
    .from("admins")
    .insert({ email, password_hash: hash })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as { id: number; email: string }
  } catch {
    return null
  }
}

export async function isAuthenticated() {
  const token = await getAuthToken()
  if (!token) return false
  const decoded = await verifyToken(token)
  return !!decoded
}
