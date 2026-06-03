"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import WhatsAppButton from "@/components/whatsapp-button"
import { getCart, removeFromCart, updateQuantity, getCartTotal, CartItem } from "@/lib/cart"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setCartItems(getCart())
    setIsLoaded(true)
    const handleUpdate = () => setCartItems(getCart())
    window.addEventListener("cart-updated", handleUpdate)
    return () => window.removeEventListener("cart-updated", handleUpdate)
  }, [])

  const handleRemove = (id: number) => {
    const updated = removeFromCart(id)
    setCartItems(updated)
    window.dispatchEvent(new Event("cart-updated"))
  }

  const handleQuantityChange = (id: number, qty: number) => {
    if (qty < 1) return
    const updated = updateQuantity(id, qty)
    setCartItems(updated)
    window.dispatchEvent(new Event("cart-updated"))
  }

  const total = getCartTotal(cartItems)

  const whatsappMessage = cartItems.length > 0
    ? `আমার অর্ডার:\n${cartItems.map(i =>
        `${i.nameBn} x${i.quantity} = ৳${i.price * i.quantity}`
      ).join('\n')}\n\nমোট: ৳${total}\n\nনাম:\nফোন:\nঠিকানা:`
    : ""

  if (!isLoaded) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">শপিং কার্ট</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">আপনার কার্ট খালি</h2>
          <p className="text-muted-foreground mb-6">আপনার পছন্দের পণ্য কার্টে যোগ করুন</p>
          <Button asChild>
            <Link href="/category/all">পণ্য দেখুন</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-lg border bg-card">
                <Link href={`/product/${item.slug}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.nameBn}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1">
                      {item.nameBn}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.name}</p>
                  <p className="text-lg font-bold text-primary mt-1">৳{item.price}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-sm">
                        ৳{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">অর্ডার সারসংক্ষেপ</h2>
              <div className="space-y-2 text-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-muted-foreground">
                    <span className="line-clamp-1">{item.nameBn} x{item.quantity}</span>
                    <span>৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-lg">মোট</span>
                <span className="font-bold text-xl text-primary">৳{total}</span>
              </div>

              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/checkout">অর্ডার নিশ্চিত করুন</Link>
                </Button>
                <WhatsAppButton
                  message={whatsappMessage}
                  className="w-full"
                  size="lg"
                >
                  হোয়াটসঅ্যাপে অর্ডার
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
