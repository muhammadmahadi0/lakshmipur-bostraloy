import Link from "next/link"
import HeroSection from "@/components/hero-section"
import ProductCard from "@/components/product-card"
import { getCategories, getFeaturedProducts, getBestSellerProducts } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export default async function HomePage() {
  const [categories, featuredProducts, bestSellerProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getBestSellerProducts(),
  ])

  return (
    <div>
      <HeroSection />

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">ক্যাটাগরি</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">আমাদের পণ্যের ক্যাটাগরি</h2>
          <p className="text-muted-foreground mt-2">আপনার পছন্দের ক্যাটাগরি নির্বাচন করুন</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-square bg-muted hover:shadow-lg transition-all duration-300"
            >
              <img
                src={cat.image || "/placeholder.png"}
                alt={cat.nameBn}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <h3 className="text-white font-bold text-sm md:text-lg">{cat.nameBn}</h3>
                <p className="text-white/70 text-xs">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">ফিচার্ড</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">উন্নত মানের পণ্য</h2>
              <p className="text-muted-foreground mt-2">আমাদের সেরা কালেকশন দেখুন</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/category/all"
                className="inline-flex items-center text-primary font-semibold hover:underline"
              >
                সকল পণ্য দেখুন &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {bestSellerProducts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">বেস্ট সেলার</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">সর্বাধিক বিক্রীত পণ্য</h2>
              <p className="text-muted-foreground mt-2">সবার পছন্দের পণ্যগুলো দেখুন</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellerProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gradient-to-r from-green-700 via-green-600 to-green-800 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">অর্ডার করতে চান?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            সরাসরি হোয়াটসঅ্যাপে অর্ডার করুন অথবা আমাদের শোরুম থেকে আপনার পছন্দের পণ্য কিনুন
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/category/all"
              className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
            >
              পণ্য দেখুন
            </Link>
            <Link
              href="https://wa.me/8801700000000?text=আমি%20পণ্য%20সম্পর্কে%20জানতে%20চাই"
              target="_blank"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              হোয়াটসঅ্যাপ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
