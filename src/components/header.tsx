"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Search, Menu, X, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { getCartCount } from "@/lib/cart"
import { getCategories, type Category } from "@/lib/data"

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  useEffect(() => {
    setCartCount(getCartCount())
    getCategories().then(setCategories)
    const handleStorage = () => setCartCount(getCartCount())
    window.addEventListener("cart-updated", handleStorage)
    window.addEventListener("storage", handleStorage)
    return () => {
      window.removeEventListener("cart-updated", handleStorage)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  const navLinks = [
    { href: "/", label: "হোম" },
    { href: "/category/all", label: "সকল পণ্য" },
    { href: "/about", label: "আমাদের সম্পর্কে" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">
              লক্ষ্মীপুর <span className="text-secondary">বস্ত্রালয়</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="relative group">
              <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                ক্যাটাগরি
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 space-y-1">
                  <Link href="/category/all" className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                    সকল ক্যাটাগরি
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                    >
                      {cat.nameBn}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Input
                type="search"
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 h-9"
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-muted-foreground hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-muted-foreground hover:text-primary"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {showSearch && (
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="flex gap-2">
              <Input type="search" placeholder="পণ্য খুঁজুন..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
              <Button type="submit" size="sm">খুঁজুন</Button>
            </div>
          </form>
        )}

        {showMobileMenu && (
          <nav className="md:hidden pb-4 border-t pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <p className="text-xs text-muted-foreground pt-3 pb-1 font-medium">ক্যাটাগরি</p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setShowMobileMenu(false)}
                className="block py-1.5 text-sm text-muted-foreground hover:text-primary pl-3"
              >
                {cat.nameBn}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
