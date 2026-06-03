import { supabaseAdmin } from "@/lib/supabase-server"
import { Package, ListOrdered, ShoppingCart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getStats() {
  try {
    const { count: productCount } = await (supabaseAdmin().from("products") as any)
      .select("*", { count: "exact", head: true })
    const { count: orderCount } = await (supabaseAdmin().from("orders") as any)
      .select("*", { count: "exact", head: true })
    const { count: categoryCount } = await (supabaseAdmin().from("categories") as any)
      .select("*", { count: "exact", head: true })
    const { data: recentOrders } = await (supabaseAdmin().from("orders") as any)
      .select("*").order("created_at", { ascending: false }).limit(5)

    return { productCount: productCount || 0, orderCount: orderCount || 0, categoryCount: categoryCount || 0, recentOrders: (recentOrders || []) }
  } catch {
    return { productCount: 0, orderCount: 0, categoryCount: 0, recentOrders: [] }
  }
}

export default async function AdminDashboard() {
  const { productCount, orderCount, categoryCount, recentOrders } = await getStats()

  const stats = [
    { label: "মোট পণ্য", value: productCount, icon: Package, color: "text-primary", bg: "bg-primary/10" },
    { label: "মোট অর্ডার", value: orderCount, icon: ShoppingCart, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "ক্যাটাগরি", value: categoryCount, icon: ListOrdered, color: "text-green-600", bg: "bg-green-100" },
    { label: "পেন্ডিং অর্ডার", value: recentOrders.filter((o: any) => o.status === "pending").length, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">ড্যাশবোর্ড</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border rounded-xl p-4 md:p-6">
            <div className={`inline-flex p-2.5 rounded-lg ${s.bg} ${s.color} mb-3`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl md:text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-4">দ্রুত লিংক</h2>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/products/new">
                <Package className="h-4 w-4 mr-2" />
                নতুন পণ্য যোগ করুন
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/products">
                <ListOrdered className="h-4 w-4 mr-2" />
                সকল পণ্য দেখুন
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/orders">
                <ShoppingCart className="h-4 w-4 mr-2" />
                অর্ডার দেখুন
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-4">সর্বশেষ অর্ডার</h2>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">কোনো অর্ডার নেই</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-muted-foreground">৳{order.total}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "confirmed" ? "bg-green-100 text-green-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {order.status === "pending" ? "পেন্ডিং" : order.status === "confirmed" ? "নিশ্চিত" : order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}