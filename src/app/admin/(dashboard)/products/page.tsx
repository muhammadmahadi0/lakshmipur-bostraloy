"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { deleteProductAction } from "./actions"

interface ProductItem {
  id: number
  slug: string
  name: string
  name_bn: string
  price: number
  original_price: number | null
  in_stock: boolean
  is_featured: boolean
  is_best_seller: boolean
  categories: { name_bn: string } | null
  images: string[]
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let query = supabase()
      .from("products")
      .select("*, categories(name_bn)")
      .order("created_at", { ascending: false })

    if (search) {
      const s = `%${search}%`
      query = query.or(`name.ilike.${s},name_bn.ilike.${s}`)
    }

    const { data } = await query
    setProducts((data || []) as ProductItem[])
    setLoading(false)
  }, [search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async (id: number) => {
    if (!confirm("নিশ্চিতভাবে পণ্যটি ডিলিট করতে চান?")) return
    setDeleting(id)
    try {
      await deleteProductAction(id)
      toast.success("পণ্য ডিলিট হয়েছে")
      fetchProducts()
    } catch {
      toast.error("ডিলিট ব্যর্থ হয়েছে")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">পণ্য তালিকা</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            নতুন পণ্য
          </Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="পণ্য খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">লোড হচ্ছে...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">কোনো পণ্য পাওয়া যায়নি</p>
          <Button asChild>
            <Link href="/admin/products/new">প্রথম পণ্য যোগ করুন</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">ছবি</th>
                  <th className="text-left p-3 font-medium">নাম</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">ক্যাটাগরি</th>
                  <th className="text-left p-3 font-medium">মূল্য</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">স্ট্যাটাস</th>
                  <th className="text-right p-3 font-medium">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3">
                      <img
                        src={p.images?.[0] || "/placeholder.png"}
                        alt={p.name_bn}
                        className="w-10 h-10 rounded object-cover"
                      />
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{p.name_bn}</p>
                      <p className="text-xs text-muted-foreground">{p.name}</p>
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">
                      {p.categories?.name_bn || "-"}
                    </td>
                    <td className="p-3">
                      <span className="font-medium">৳{p.price}</span>
                      {p.original_price && (
                        <span className="text-xs text-muted-foreground line-through ml-1">
                          ৳{p.original_price}
                        </span>
                      )}
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {!p.in_stock && <Badge variant="destructive" className="text-xs">স্টক আউট</Badge>}
                        {p.is_featured && <Badge variant="secondary" className="text-xs">ফিচার্ড</Badge>}
                        {p.is_best_seller && <Badge className="text-xs">বেস্ট সেলার</Badge>}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/admin/products/${p.id}/edit`}>
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}