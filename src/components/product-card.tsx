"use client"

import Link from "next/link"
import { ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { addToCart, CartItem } from "@/lib/cart"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
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
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group relative rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.nameBn}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            -{discount}%
          </Badge>
        )}
        {product.isBestSeller && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            বেস্ট সেলার
          </Badge>
        )}
      </Link>

      <div className="p-3 md:p-4">
        <Link href={`/category/${product.category}`}>
          <p className="text-xs text-muted-foreground mb-1 hover:text-primary transition-colors">
            {product.categoryBn}
          </p>
        </Link>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm md:text-base line-clamp-1 hover:text-primary transition-colors">
            {product.nameBn}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-primary">৳{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">৳{product.originalPrice}</span>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
            <Link href={`/product/${product.slug}`}>
              <Eye className="h-3 w-3 mr-1" />
              দেখুন
            </Link>
          </Button>
          <Button size="sm" className="flex-1 text-xs" onClick={handleAddToCart}>
            <ShoppingCart className="h-3 w-3 mr-1" />
            কার্টে
          </Button>
        </div>
      </div>
    </div>
  )
}
