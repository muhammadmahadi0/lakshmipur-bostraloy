"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Store, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { verifyAdminAction } from "./actions"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await verifyAdminAction(email, password)
      if (result.success) {
        router.push("/admin")
      } else {
        setError(result.error || "লগইন ব্যর্থ হয়েছে")
      }
    } catch {
      setError("লগইন ব্যর্থ হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Store className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-primary">
            লক্ষ্মীপুর <span className="text-secondary">বস্ত্রালয়</span>
          </h1>
          <p className="text-muted-foreground mt-1">এডমিন প্যানেল</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
          <div className="text-center mb-2">
            <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
            <h2 className="text-lg font-semibold mt-2">এডমিন লগইন</h2>
          </div>

          <div>
            <Label htmlFor="email">ইমেইল</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "লগইন হচ্ছে..." : "লগইন"}
          </Button>
        </form>
      </div>
    </div>
  )
}
