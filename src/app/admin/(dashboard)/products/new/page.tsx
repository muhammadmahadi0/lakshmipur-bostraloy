"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { createProductAction } from "../actions"

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", name_bn: "", category_id: "",
    price: "", original_price: "", description: "", description_bn: "",
    images: "", in_stock: true, is_featured: false, is_best_seller: false,
  })

  useEffect(() => {
    supabase().from("categories").select("*").order("id").then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.name_bn || !form.price || !form.category_id) {
      toast.error("নাম, বাংলা নাম, মূল্য এবং ক্যাটাগরি আবশ্যক")
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      await createProductAction(fd)
      toast.success("পণ্য যোগ হয়েছে")
      router.push("/admin/products")
    } catch (err: any) {
      toast.error(err.message || "পণ্য যোগ ব্যর্থ হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">নতুন পণ্য</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">মৌলিক তথ্য</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>নাম (ইংরেজি) *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
            </div>
            <div>
              <Label>নাম (বাংলা) *</Label>
              <Input value={form.name_bn} onChange={(e) => setForm({ ...form, name_bn: e.target.value })} placeholder="পণ্যের নাম" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>ক্যাটাগরি *</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="ক্যাটাগরি নির্বাচন" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name_bn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>মূল্য *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="০" />
              </div>
              <div>
                <Label>পূর্বের মূল্য</Label>
                <Input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} placeholder="ঐচ্ছিক" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">বিবরণ</h2>
          <div>
            <Label>বিবরণ (ইংরেজি)</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div>
            <Label>বিবরণ (বাংলা)</Label>
            <Textarea value={form.description_bn} onChange={(e) => setForm({ ...form, description_bn: e.target.value })} rows={3} />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">ছবি</h2>
          <div>
            <Label>ছবির URL (প্রতি লাইনে একটি)</Label>
            <Textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={3} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">অন্যান্য সেটিংস</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <Checkbox checked={form.in_stock} onCheckedChange={(v) => setForm({ ...form, in_stock: !!v })} />
              <span className="text-sm">স্টকে আছে</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: !!v })} />
              <span className="text-sm">ফিচার্ড</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox checked={form.is_best_seller} onCheckedChange={(v) => setForm({ ...form, is_best_seller: !!v })} />
              <span className="text-sm">বেস্ট সেলার</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "সেভ হচ্ছে..." : "পণ্য যোগ করুন"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            বাতিল
          </Button>
        </div>
      </form>
    </div>
  )
}