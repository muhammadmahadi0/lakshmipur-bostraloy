import Link from "next/link"
import { Store, Phone, MapPin, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-6 w-6" />
              <span className="text-lg font-bold">
                লক্ষ্মীপুর <span className="text-secondary">বস্ত্রালয়</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              লক্ষ্মীপুর বস্ত্রালয় - ঐতিহ্যবাহী বাংলাদেশি পোশাকের নির্ভরযোগ্য ঠিকানা। 
              আমরা সরবরাহ করি উচ্চমানের লুঙ্গি, পাঞ্জাবি, পাজামা, ফতুয়া, ব্লাউজ, পেটিকোট, 
              মশারি, টাওয়েল সহ সকল প্রকার ঐতিহ্যবাহী পোশাক।
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">হোম</Link></li>
              <li><Link href="/category/all" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">সকল পণ্য</Link></li>
              <li><Link href="/about" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/cart" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">কার্ট</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  লক্ষ্মীপুর সদর, লক্ষ্মীপুর
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+8801700000000" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  +৮৮০ ১৭০০-০০০০০০
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  সকাল ৯টা - রাত ৯টা (শুক্রবার বন্ধ)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center">
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} লক্ষ্মীপুর বস্ত্রালয়। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  )
}
