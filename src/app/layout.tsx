import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "লক্ষ্মীপুর বস্ত্রালয় | Lakshmipur Bostraloy",
  description: "ঐতিহ্যবাহী বাংলাদেশি পোশাকের নির্ভরযোগ্য ঠিকানা - লুঙ্গি, পাঞ্জাবি, পাজামা, ফতুয়া, ব্লাউজ, পেটিকোট, মশারি, টাওয়েল",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
