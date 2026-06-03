"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Package, ListOrdered, ShoppingCart, Store, X, Menu
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/admin/products", label: "পণ্য", icon: Package },
  { href: "/admin/categories", label: "ক্যাটাগরি", icon: ListOrdered },
  { href: "/admin/orders", label: "অর্ডার", icon: ShoppingCart },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm text-primary">
            লক্ষ্মীপুর <span className="text-secondary">বস্ত্রালয়</span>
          </span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">এডমিন প্যানেল</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          &larr; ওয়েবসাইটে ফিরে যান
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-lg shadow"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside className="hidden lg:flex w-60 shrink-0 border-r bg-card flex-col">
        {sidebar}
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-card border-r shadow-xl">
            {sidebar}
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}