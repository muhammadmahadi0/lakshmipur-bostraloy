"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newCat, setNewCat] = useState({ slug: "", name: "", name_bn: "", image: "" })
  const [editing, setEditing] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ slug: "", name: "", name_bn: "", image: "" })

  const fetchCategories = async () => {
    const { data } = await supabase().from("categories").select("*").order("id")
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleAdd = async () => {
    if (!newCat.slug || !newCat.name) {
      toast.error("Slug এবং Name আবশ্যক")
      return
    }
    const { error } = await (supabase().from("categories") as any).insert(newCat)
    if (error) { toast.error(error.message); return }
    toast.success("ক্যাটাগরি যোগ হয়েছে")
    setNewCat({ slug: "", name: "", name_bn: "", image: "" })
    fetchCategories()
  }

  const handleUpdate = async (id: number) => {
    const { error } = await (supabase().from("categories") as any).update(editForm).eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("আপডেট হয়েছে")
    setEditing(null)
    fetchCategories()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("নিশ্চিতভাবে ডিলিট করতে চান?")) return
    const { error } = await (supabase().from("categories") as any).delete().eq("id", id)
    if (error) { toast.error(error.message); return }
    toast.success("ডিলিট হয়েছে")
    fetchCategories()
  }

  const startEdit = (cat: any) => {
    setEditing(cat.id)
    setEditForm({ slug: cat.slug, name: cat.name, name_bn: cat.name_bn, image: cat.image })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">ক্যাটাগরি ব্যবস্থাপনা</h1>

      <div className="bg-card border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">নতুন ক্যাটাগরি</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input placeholder="Slug" value={newCat.slug} onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })} />
          <Input placeholder="Name (English)" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
          <Input placeholder="নাম (বাংলা)" value={newCat.name_bn} onChange={(e) => setNewCat({ ...newCat, name_bn: e.target.value })} />
          <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />যোগ করুন</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">লোড হচ্ছে...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">কোনো ক্যাটাগরি নেই</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-card border rounded-xl p-4">
              {editing === cat.id ? (
                <div className="space-y-3">
                  <Input value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} placeholder="Slug" />
                  <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                  <Input value={editForm.name_bn} onChange={(e) => setEditForm({ ...editForm, name_bn: e.target.value })} placeholder="বাংলা নাম" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(cat.id)}>সেভ</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>বাতিল</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    {cat.image && (
                      <img src={cat.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="font-semibold">{cat.name_bn}</p>
                      <p className="text-xs text-muted-foreground">{cat.name} ({cat.slug})</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(cat)}>
                      <Edit2 className="h-3 w-3 mr-1" /> এডিট
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(cat.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}