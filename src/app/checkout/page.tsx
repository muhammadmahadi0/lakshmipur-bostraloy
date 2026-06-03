"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import WhatsAppButton from "@/components/whatsapp-button"
import { getCart, getCartTotal, clearCart, CartItem } from "@/lib/cart"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", note: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setCartItems(getCart())
    setIsLoaded(true)
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "নাম আবশ্যক"
    if (!formData.phone.trim()) newErrors.phone = "ফোন নম্বর আবশ্যক"
    else if (!/^(\+?88)?01[3-9]\d{8}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "বৈধ ফোন নম্বর দিন"
    if (!formData.address.trim()) newErrors.address = "ঠিকানা আবশ্যক"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const { error } = await (supabase().from("orders") as any).insert({
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        note: formData.note,
        items: cartItems,
        total: getCartTotal(cartItems),
        status: "pending",
      })

      if (error) {
        toast.error("অর্ডার জমা দিতে সমস্যা হয়েছে")
        setSaving(false)
        return
      }

      clearCart()
      window.dispatchEvent(new Event("cart-updated"))
      setSubmitted(true)
    } catch {
      toast.error("অর্ডার জমা দিতে সমস্যা হয়েছে")
    } finally {
      setSaving(false)
    }
  }

  const total = getCartTotal(cartItems)

  const whatsappMessage = submitted
    ? `নতুন অর্ডার:\n\nনাম: ${formData.name}\nফোন: ${formData.phone}\nঠিকানা: ${formData.address}\nনোট: ${formData.note || "না"}\n\nপণ্য:\n${cartItems.map(i => `${i.nameBn} x${i.quantity} = ৳${i.price * i.quantity}`).join('\n')}\n\nমোট: ৳${total}`
    : ""

  if (!isLoaded) return null

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">আপনার কার্ট খালি</h1>
        <p className="text-muted-foreground mb-6">অর্ডার করতে প্রথমে পণ্য নির্বাচন করুন</p>
        <Button asChild><Link href="/category/all">পণ্য দেখুন</Link></Button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">অর্ডার গৃহীত হয়েছে!</h1>
          <p className="text-muted-foreground mb-6">আপনার অর্ডারটি আমরা পেয়েছি। খুব শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।</p>

          <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-3">আপনার তথ্য</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">নাম:</span> {formData.name}</p>
              <p><span className="font-medium">ফোন:</span> {formData.phone}</p>
              <p><span className="font-medium">ঠিকানা:</span> {formData.address}</p>
              {formData.note && <p><span className="font-medium">নোট:</span> {formData.note}</p>}
            </div>
            <Separator className="my-4" />
            <div className="space-y-1 text-sm">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.nameBn} x{item.quantity}</span>
                  <span>৳{item.price * item.quantity}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>মোট</span>
                <span className="text-primary">৳{total}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <WhatsAppButton message={whatsappMessage} size="lg" className="w-full">
              হোয়াটসঅ্যাপে নিশ্চিত করুন
            </WhatsAppButton>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/category/all">আরও পণ্য দেখুন</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart" className="text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">চেকআউট</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">প্রাপকের তথ্য</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">নাম *</Label>
                  <Input id="name" placeholder="আপনার নাম লিখুন" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? "border-destructive" : ""} />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">ফোন নম্বর *</Label>
                  <Input id="phone" placeholder="০১৭০০-০০০০০০" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={errors.phone ? "border-destructive" : ""} />
                  {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="address">ঠিকানা *</Label>
                  <Input id="address" placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={errors.address ? "border-destructive" : ""} />
                  {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="note">নোট (ঐচ্ছিক)</Label>
                  <Input id="note" placeholder="কোনো বিশেষ অনুরোধ থাকলে লিখুন" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-base" disabled={saving}>
              {saving ? "অর্ডার জমা হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">অর্ডার সারসংক্ষেপ</h2>
            <div className="space-y-2 text-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="line-clamp-1">{item.nameBn} x{item.quantity}</span>
                  <span>৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center font-bold text-lg">
              <span>মোট</span>
              <span className="text-primary">৳{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
