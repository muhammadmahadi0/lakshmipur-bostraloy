"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ShoppingCart, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ProductCard from "@/components/product-card"
import WhatsAppButton from "@/components/whatsapp-button"
import { getProductBySlug, getProductsByCategory, type Product } from "@/lib/data"
import { addToCart, CartItem } from "@/lib/cart"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProductBySlug(slug).then((p) => {
      setProduct(p)
      if (p) {
        getProductsByCategory(p.category).then((all) => {
          setRelatedProducts(all.filter(r => r.id !== p.id).slice(0, 4))
        })
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">পণ্য পাওয়া যায়নি</h1>
        <p className="text-muted-foreground mt-2">আপনার অনুরোধকৃত পণ্যটি খুঁজে পাওয়া যায়নি</p>
        <Button className="mt-6" asChild>
          <Link href="/category/all">সকল পণ্য দেখুন</Link>
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    const item: Omit<CartItem, "quantity"> = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      nameBn: product.nameBn,
      price: product.price,
      image: product.image,
    }
    addToCart(item)
    window.dispatchEvent(new Event("cart-updated"))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const whatsappMessage = `আমি ${product.nameBn} অর্ডার করতে চাই (কোড: #${product.id})\nমূল্য: ৳${product.price}\nপরিমাণ: ${quantity} পিস`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">হোম</Link>
        <span>/</span>
        <Link href={`/category/${product.category}`} className="hover:text-primary">{product.categoryBn}</Link>
        <span>/</span>
        <span className="text-foreground">{product.nameBn}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          <img src={product.image} alt={product.nameBn} className="object-cover w-full h-full" />
          {discount > 0 && (
            <Badge variant="destructive" className="absolute top-4 left-4 text-sm px-3 py-1">-{discount}%</Badge>
          )}
        </div>

        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit mb-3">{product.categoryBn}</Badge>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.nameBn}</h1>
          <p className="text-muted-foreground mb-4">{product.name}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">৳{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">৳{product.originalPrice}</span>
                <Badge variant="destructive">সাশ্রয় {discount}%</Badge>
              </>
            )}
          </div>

          <Separator className="mb-6" />

          <div className="mb-6">
            <h3 className="font-semibold mb-2">বিবরণ</h3>
            <p className="text-muted-foreground leading-relaxed">{product.descriptionBn}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">পরিমাণ</h3>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold w-10 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <Button size="lg" className="flex-1 text-base" onClick={handleAddToCart}>
              {addedToCart ? <><Check className="h-5 w-5 mr-2" /> যুক্ত হয়েছে</> : <><ShoppingCart className="h-5 w-5 mr-2" /> কার্টে যোগ করুন</>}
            </Button>
            <WhatsAppButton message={whatsappMessage} size="lg" className="flex-1 text-base">
              <ShoppingCart className="h-5 w-5 mr-2" /> হোয়াটসঅ্যাপে অর্ডার
            </WhatsAppButton>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" /> স্টকে আছে
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Check className="h-4 w-4 text-primary" /> অর্ডার করলে ২৪-৪৮ ঘন্টার মধ্যে ডেলিভারি
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">আরও {product.categoryBn}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
