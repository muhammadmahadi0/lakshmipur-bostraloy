"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase()
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id: number, status: string) => {
    const { error } = await (supabase().from("orders") as any).update({ status }).eq("id", id)
    if (error) { toast.error("আপডেট ব্যর্থ"); return }
    toast.success(`অর্ডার ${status === "confirmed" ? "নিশ্চিত" : "বাতিল"} হয়েছে`)
    fetchOrders()
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    const labels: Record<string, string> = {
      pending: "পেন্ডিং", confirmed: "নিশ্চিত", cancelled: "বাতিল",
    }
    return <Badge className={styles[status] || ""}>{labels[status] || status}</Badge>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">অর্ডার তালিকা</h1>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">লোড হচ্ছে...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">কোনো অর্ডার নেই</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg">#{order.id}</span>
                    {statusBadge(order.status)}
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("bn")}
                    </span>
                  </div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{order.customer_address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-primary">৳{order.total}</span>
                    <span className="text-sm text-muted-foreground">({order.items?.length || 0} টি পণ্য)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                    <Eye className="h-4 w-4 mr-1" /> বিস্তারিত
                  </Button>
                  {order.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(order.id, "confirmed")}>
                        <Check className="h-4 w-4 mr-1" /> নিশ্চিত
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatus(order.id, "cancelled")}>
                        <X className="h-4 w-4 mr-1" /> বাতিল
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {selectedOrder?.id === order.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-2">অর্ডারকৃত পণ্য:</h4>
                  <div className="space-y-2">
                    {(order.items || []).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />
                          <span>{item.nameBn} x{item.quantity}</span>
                        </div>
                        <span>৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm">
                    <p><span className="font-medium">ঠিকানা:</span> {order.customer_address}</p>
                    {order.note && <p><span className="font-medium">নোট:</span> {order.note}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}