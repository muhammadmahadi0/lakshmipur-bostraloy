"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProductCard from "@/components/product-card"
import { getProducts, getCategories, type Product, type Category } from "@/lib/data"

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string

  const initialSearch = searchParams.get("search") || ""
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    getProducts({
      category: slug === "all" ? undefined : slug,
      search: searchQuery || undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
    }).then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [slug, searchQuery, priceRange])

  const categoryInfo = categories.find(c => c.slug === slug)
  const title = slug === "all" ? "সকল পণ্য" : categoryInfo?.nameBn || "পণ্য"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:text-primary">হোম</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{title}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? "..." : `${products.length} টি পণ্য পাওয়া গেছে`}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 md:flex-none">
            <Input
              type="search"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary text-primary-foreground" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">মূল্য (ন্যূনতম)</label>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-28"
                min={0}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">মূল্য (সর্বোচ্চ)</label>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-28"
                min={0}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => setPriceRange([0, 5000])}>রিসেট</Button>
          </div>
        </div>
      )}

      {slug !== "all" && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/category/all">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">সকল পণ্য</Badge>
          </Link>
          {categories.filter(c => c.slug !== slug).slice(0, 8).map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">{cat.nameBn}</Badge>
            </Link>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-5 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">কোনো পণ্য পাওয়া যায়নি</h3>
          <p className="text-muted-foreground mb-4">আপনার সার্চের সাথে মিলে এমন কোনো পণ্য নেই</p>
          <Button variant="outline" onClick={() => { setSearchQuery(""); setPriceRange([0, 5000]) }}>
            ফিল্টার রিসেট করুন
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
