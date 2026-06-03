"use client"

import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "./actions"

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction()
    router.push("/admin/login")
  }

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <span className="font-bold text-sm text-primary">
          লক্ষ্মীপুর <span className="text-secondary">বস্ত্রালয়</span>
        </span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">এডমিন</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">লগআউট</span>
        </Button>
      </div>
    </header>
  )
}