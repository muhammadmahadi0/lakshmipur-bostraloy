import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-green-700 via-green-600 to-green-800 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559551407-e0e5d7f7e9c9?w=1920')] bg-cover bg-center opacity-10" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-block bg-secondary/20 backdrop-blur-sm text-secondary text-sm px-4 py-1 rounded-full mb-4 border border-secondary/30">
            ঐতিহ্যবাহী বাংলাদেশি পোশাকের নির্ভরযোগ্য ঠিকানা
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            লক্ষ্মীপুর <span className="text-secondary">বস্ত্রালয়</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
            উচ্চমানের লুঙ্গি, পাঞ্জাবি, পাজামা, ফতুয়া, ব্লাউজ, পেটিকোট, মশারি, টাওয়েল সহ 
            সকল প্রকার ঐতিহ্যবাহী পোশাক পাচ্ছেন আমাদের এখানে। সেরা মান, সাশ্রয়ী মূল্য।
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="secondary" className="font-semibold text-base" asChild>
              <Link href="/category/all">সকল পণ্য দেখুন</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/20 text-base" asChild>
              <Link href="/about">আমাদের সম্পর্কে</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
