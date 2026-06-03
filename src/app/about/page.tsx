import Link from "next/link"
import { Store, Shield, Truck, Award, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">হোম</Link>
        <span>/</span>
        <span className="text-foreground font-medium">আমাদের সম্পর্কে</span>
      </div>

      <section className="mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <Store className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            লক্ষ্মীপুর <span className="text-secondary">বস্ত্রালয়</span>
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            লক্ষ্মীপুর বস্ত্রালয় একটি ঐতিহ্যবাহী বাংলাদেশি পোশাকের দোকান। 
            আমরা লক্ষ্মীপুর জেলার ক্রেতাদের জন্য উচ্চমানের লুঙ্গি, পাঞ্জাবি, পাজামা, ফতুয়া, 
            ব্লাউজ, পেটিকোট, মশারি, টাওয়েল ও কিডস শাড়ি সরবরাহ করে আসছি। 
            আমাদের লক্ষ্য হলো সাশ্রয়ী মূল্যে সেরা মানের পোশাক পৌঁছে দেওয়া।
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Shield, title: "উচ্চমানের পণ্য", desc: "আমরা সবসময় মানসম্মত ও টেকসই পোশাক সরবরাহ করি" },
          { icon: Truck, title: "দ্রুত ডেলিভারি", desc: "অর্ডার করার ২৪-৪৮ ঘন্টার মধ্যে হোম ডেলিভারি" },
          { icon: Award, title: "সাশ্রয়ী মূল্য", desc: "সর্বোচ্চ মান নিশ্চিত করে সর্বনিম্ন মূল্য নির্ধারণ" },
          { icon: Store, title: "বিশ্বস্ত প্রতিষ্ঠান", desc: "লক্ষ্মীপুরের ক্রেতাদের কাছে একটি পরিচিত নাম" },
        ].map((item, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-muted/50 rounded-xl p-8 mb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-primary mb-8">আমাদের ঠিকানা</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold">ঠিকানা</h3>
                <p className="text-sm text-muted-foreground">
                  লক্ষ্মীপুর সদর, লক্ষ্মীপুর
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold">ফোন</h3>
                <a href="tel:+8801700000000" className="text-sm text-muted-foreground hover:text-primary">
                  +৮৮০ ১৭০০-০০০০০০
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold">সময়সূচী</h3>
                <p className="text-sm text-muted-foreground">
                  সকাল ৯টা - রাত ৯টা<br />
                  শুক্রবার বন্ধ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">আজই অর্ডার করুন</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          আমাদের পণ্য দেখতে ভিজিট করুন আমাদের শোরুম অথবা অনলাইনে অর্ডার করুন
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/category/all">পণ্য দেখুন</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://wa.me/8801700000000" target="_blank">
              হোয়াটসঅ্যাপ
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
