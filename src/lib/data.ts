import { supabase } from "./supabase"

export interface Product {
  id: number
  slug: string
  name: string
  nameBn: string
  category: string
  categoryBn: string
  categoryId?: number
  price: number
  originalPrice: number | null
  description: string
  descriptionBn: string
  image: string
  images: string[]
  inStock: boolean
  isFeatured: boolean
  isBestSeller: boolean
  createdAt?: string
}

export interface Category {
  id: number
  slug: string
  name: string
  nameBn: string
  image: string
}

export interface Order {
  id: number
  customer_name: string
  customer_phone: string
  customer_address: string
  note: string
  items: any[]
  total: number
  status: string
  created_at: string
}

// Helper to map DB product to frontend Product
function mapProduct(p: any): Product {
  const img = p.images?.[0] || "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=600&fit=crop"
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    nameBn: p.name_bn,
    category: p.categories?.slug || "",
    categoryBn: p.categories?.name_bn || "",
    categoryId: p.category_id,
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : null,
    description: p.description || "",
    descriptionBn: p.description_bn || "",
    image: img,
    images: p.images || [img],
    inStock: p.in_stock ?? true,
    isFeatured: p.is_featured ?? false,
    isBestSeller: p.is_best_seller ?? false,
    createdAt: p.created_at,
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await (supabase().from("categories") as any).select("*").order("id")
    return (data as Category[]) || []
  } catch {
    return []
  }
}

export async function getProducts(options?: {
  category?: string
  featured?: boolean
  bestSeller?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
}): Promise<Product[]> {
  let query = (supabase().from("products") as any)
    .select("*, categories(slug, name, name_bn)")
    .eq("in_stock", true)
    .order("created_at", { ascending: false })

  if (options?.category && options.category !== "all") {
    const { data: cat } = await (supabase().from("categories") as any)
      .select("id")
      .eq("slug", options.category)
      .single()
    if (cat) query = query.eq("category_id", cat.id)
  }

  if (options?.featured) query = query.eq("is_featured", true)
  if (options?.bestSeller) query = query.eq("is_best_seller", true)
  if (options?.search) {
    const s = `%${options.search}%`
    query = query.or(`name.ilike.${s},name_bn.ilike.${s}`)
  }
  if (options?.minPrice !== undefined) query = query.gte("price", options.minPrice)
  if (options?.maxPrice !== undefined) query = query.lte("price", options.maxPrice)
  if (options?.limit) query = query.limit(options.limit)

  try {
    const { data } = await query
    return (data || []).map(mapProduct)
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await (supabase().from("products") as any)
      .select("*, categories(slug, name, name_bn)")
      .eq("slug", slug)
      .single()
    return data ? mapProduct(data) : null
  } catch {
    return null
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return getProducts({ category })
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true })
}

export async function getBestSellerProducts(): Promise<Product[]> {
  return getProducts({ bestSeller: true })
}

export async function searchProducts(query: string): Promise<Product[]> {
  return getProducts({ search: query })
}
