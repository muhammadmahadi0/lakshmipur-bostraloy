import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import AdminSidebar from "./sidebar"
import AdminHeader from "./header"

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated()
  if (!authed) redirect("/admin/login")

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}