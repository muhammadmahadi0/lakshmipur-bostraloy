"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { isAuthenticated } from "@/lib/auth"

export async function deleteProductAction(id: number) {
  const authed = await isAuthenticated()
  if (!authed) throw new Error("Unauthorized")

  const { error } = await supabaseAdmin().from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)
  return { success: true }
}

export async function createProductAction(formData: FormData) {
  const authed = await isAuthenticated()
  if (!authed) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const nameBn = formData.get("name_bn") as string
  const categoryId = parseInt(formData.get("category_id") as string)
  const price = parseFloat(formData.get("price") as string)
  const originalPriceStr = formData.get("original_price") as string
  const description = formData.get("description") as string
  const descriptionBn = formData.get("description_bn") as string
  const inStock = formData.get("in_stock") === "true"
  const isFeatured = formData.get("is_featured") === "true"
  const isBestSeller = formData.get("is_best_seller") === "true"
  const imagesRaw = formData.get("images") as string

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const images = imagesRaw ? imagesRaw.split("\n").map(s => s.trim()).filter(Boolean) : []
  const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null

  const { data, error } = await supabaseAdmin().from("products").insert({
    slug: slug + "-" + Date.now(),
    name, name_bn: nameBn, category_id: categoryId,
    price, original_price: originalPrice,
    description, description_bn: descriptionBn,
    images, in_stock: inStock,
    is_featured: isFeatured, is_best_seller: isBestSeller,
  }).select().single()

  if (error) throw new Error(error.message)
  return { success: true, product: data }
}

export async function updateProductAction(id: number, formData: FormData) {
  const authed = await isAuthenticated()
  if (!authed) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const nameBn = formData.get("name_bn") as string
  const categoryId = parseInt(formData.get("category_id") as string)
  const price = parseFloat(formData.get("price") as string)
  const originalPriceStr = formData.get("original_price") as string
  const description = formData.get("description") as string
  const descriptionBn = formData.get("description_bn") as string
  const inStock = formData.get("in_stock") === "true"
  const isFeatured = formData.get("is_featured") === "true"
  const isBestSeller = formData.get("is_best_seller") === "true"
  const imagesRaw = formData.get("images") as string

  const images = imagesRaw ? imagesRaw.split("\n").map(s => s.trim()).filter(Boolean) : []
  const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null

  const { error } = await supabaseAdmin().from("products").update({
    name, name_bn: nameBn, category_id: categoryId,
    price, original_price: originalPrice,
    description, description_bn: descriptionBn,
    images, in_stock: inStock,
    is_featured: isFeatured, is_best_seller: isBestSeller,
    updated_at: new Date().toISOString(),
  }).eq("id", id)

  if (error) throw new Error(error.message)
  return { success: true }
}