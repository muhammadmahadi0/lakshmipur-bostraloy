export interface Product {
  id: number
  slug: string
  name: string
  nameBn: string
  category: string
  categoryBn: string
  price: number
  originalPrice?: number
  description: string
  descriptionBn: string
  image: string
  images: string[]
  inStock: boolean
  isFeatured?: boolean
  isBestSeller?: boolean
}

export const products: Product[] = [
  {
    id: 1,
    slug: "cotton-lungi-blue",
    name: "Cotton Lungi - Blue",
    nameBn: "কটন লুঙ্গি - নীল",
    category: "lungi",
    categoryBn: "লুঙ্গি",
    price: 350,
    originalPrice: 450,
    description: "High quality pure cotton blue lungi with traditional border design. Comfortable for daily wear.",
    descriptionBn: "উচ্চ মানের খাঁটি কটনের নীল লুঙ্গি যাতে ঐতিহ্যবাহী বর্ডার ডিজাইন। দৈনন্দিন ব্যবহারের জন্য আরামদায়ক।",
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: 2,
    slug: "designer-panjabi-white",
    name: "Designer Panjabi - White",
    nameBn: "ডিজাইনার পাঞ্জাবি - সাদা",
    category: "panjabi",
    categoryBn: "পাঞ্জাবি",
    price: 1200,
    originalPrice: 1500,
    description: "Elegant white panjabi with modern cutting and premium fabric. Perfect for Eid and special occasions.",
    descriptionBn: "আধুনিক কাটিং এবং প্রিমিয়াম ফেব্রিক সহ সাদা পাঞ্জাবি। ঈদ এবং বিশেষ উপলক্ষ্যের জন্য উপযুক্ত।",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 3,
    slug: "silk-panjabi-gold",
    name: "Silk Panjabi - Gold",
    nameBn: "সিল্ক পাঞ্জাবি - গোল্ডেন",
    category: "panjabi",
    categoryBn: "পাঞ্জাবি",
    price: 2500,
    originalPrice: 3200,
    description: "Luxurious silk panjabi in golden shade with embroidered neck design. Premium quality for weddings.",
    descriptionBn: "গোল্ডেন শেডের বিলাসবহুল সিল্ক পাঞ্জাবি যাতে এমব্রয়ডারি করা নেক ডিজাইন। বিবাহের জন্য প্রিমিয়াম কোয়ালিটি।",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: 4,
    slug: "cotton-pajama-white",
    name: "Cotton Pajama - White",
    nameBn: "কটন পাজামা - সাদা",
    category: "pajama",
    categoryBn: "পাজামা",
    price: 400,
    originalPrice: 500,
    description: "Comfortable cotton pajama with elastic waist. Perfect for daily use and religious occasions.",
    descriptionBn: "ইলাস্টিক কোমরবন্ধ সহ আরামদায়ক কটন পাজামা। দৈনন্দিন ব্যবহার এবং ধর্মীয় অনুষ্ঠানের জন্য উপযুক্ত।",
    image: "https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=600&h=600&fit=crop"],
    inStock: true,
    isBestSeller: true
  },
  {
    id: 5,
    slug: "designer-fatua-blue",
    name: "Designer Fatua - Blue",
    nameBn: "ডিজাইনার ফতুয়া - নীল",
    category: "fatua",
    categoryBn: "ফতুয়া",
    price: 650,
    originalPrice: 800,
    description: "Trendy blue fatua with chest pocket design. Lightweight and breathable fabric for summer.",
    descriptionBn: "চেস্ট পকেট ডিজাইন সহ ট্রেন্ডি নীল ফতুয়া। গ্রীষ্মের জন্য হালকা ওজনের এবং শ্বাস-প্রশ্বাসযোগ্য ফেব্রিক।",
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 6,
    slug: "check-lungi-red",
    name: "Check Lungi - Red",
    nameBn: "চেক লুঙ্গি - লাল",
    category: "lungi",
    categoryBn: "লুঙ্গি",
    price: 380,
    originalPrice: 480,
    description: "Traditional red check lungi made from fine cotton. Features classic border patterns.",
    descriptionBn: "ফাইন কটন দিয়ে তৈরি ঐতিহ্যবাহী লাল চেক লুঙ্গি। ক্লাসিক বর্ডার প্যাটার্ন সহ।",
    image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&h=600&fit=crop"],
    inStock: true,
    isBestSeller: true
  },
  {
    id: 7,
    slug: "embroidered-blouse-red",
    name: "Embroidered Blouse - Red",
    nameBn: "এমব্রয়ডারি ব্লাউজ - লাল",
    category: "blouse",
    categoryBn: "ব্লাউজ",
    price: 550,
    originalPrice: 700,
    description: "Beautiful red blouse with hand embroidery work. Matching saree blouse design.",
    descriptionBn: "হাতের এমব্রয়ডারি কাজ সহ সুন্দর লাল ব্লাউজ। ম্যাচিং শাড়ি ব্লাউজ ডিজাইন।",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 8,
    slug: "petticoat-green",
    name: "Petticoat - Green",
    nameBn: "পেটিকোট - সবুজ",
    category: "petticoat",
    categoryBn: "পেটিকোট",
    price: 450,
    originalPrice: 550,
    description: "Comfortable green petticoat with adjustable waist. Premium quality fabric with good volume.",
    descriptionBn: "এডজাস্টেবল কোমর সহ আরামদায়ক সবুজ পেটিকোট। ভালো ভলিউম সহ প্রিমিয়াম কোয়ালিটি ফেব্রিক।",
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652b6?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652b6?w=600&h=600&fit=crop"],
    inStock: true
  },
  {
    id: 9,
    slug: "mosquito-net-double",
    name: "Mosquito Net - Double Bed",
    nameBn: "মশারি - ডাবল বেড",
    category: "moshari",
    categoryBn: "মশারি",
    price: 850,
    originalPrice: 1100,
    description: "High quality double bed mosquito net with strong mesh. Easy to install with hanging loop.",
    descriptionBn: "শক্তিশালী জাল সহ উচ্চ মানের ডাবল বেড মশারি। হ্যাঙ্গিং লুপ সহ সহজ ইনস্টলেশন।",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 10,
    slug: "bath-towel-soft",
    name: "Soft Bath Towel - Blue",
    nameBn: "সফট বাথ টাওয়েল - নীল",
    category: "towel",
    categoryBn: "টাওয়েল",
    price: 350,
    originalPrice: 450,
    description: "Ultra soft and absorbent bath towel made from premium cotton. 70x140 cm size.",
    descriptionBn: "প্রিমিয়াম কটন দিয়ে তৈরি অল্ট্রা সফট এবং শোষণক্ষম বাথ টাওয়েল। ৭০x১৪০ সেমি সাইজ।",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop"],
    inStock: true,
    isBestSeller: true
  },
  {
    id: 11,
    slug: "kids-saree-pink",
    name: "Kids Saree - Pink",
    nameBn: "কিডস শাড়ি - গোলাপী",
    category: "kids-saree",
    categoryBn: "কিডস শাড়ি",
    price: 650,
    originalPrice: 850,
    description: "Adorable pink saree for little girls with golden border. Lightweight and comfortable for kids.",
    descriptionBn: "গোল্ডেন বর্ডার সহ ছোট মেয়েদের জন্য আরাধ্য গোলাপী শাড়ি। বাচ্চাদের জন্য হালকা ও আরামদায়ক।",
    image: "https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 12,
    slug: "designer-lungi-green",
    name: "Designer Lungi - Green",
    nameBn: "ডিজাইনার লুঙ্গি - সবুজ",
    category: "lungi",
    categoryBn: "লুঙ্গি",
    price: 420,
    originalPrice: 550,
    description: "Premium designer green lungi with artistic border work. Made from super soft cotton.",
    descriptionBn: "আর্টিস্টিক বর্ডার কাজ সহ প্রিমিয়াম ডিজাইনার সবুজ লুঙ্গি। সুপার সফট কটন দিয়ে তৈরি।",
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=600&fit=crop"],
    inStock: true,
    isBestSeller: true
  },
  {
    id: 13,
    slug: "linen-panjabi-brown",
    name: "Linen Panjabi - Brown",
    nameBn: "লিনেন পাঞ্জাবি - বাদামী",
    category: "panjabi",
    categoryBn: "পাঞ্জাবি",
    price: 1500,
    originalPrice: 1900,
    description: "Premium linen panjabi in earthy brown tone. Breathable fabric perfect for summer events.",
    descriptionBn: "মাটির বাদামী টোনে প্রিমিয়াম লিনেন পাঞ্জাবি। গ্রীষ্মের অনুষ্ঠানের জন্য শ্বাস-প্রশ্বাসযোগ্য ফেব্রিক।",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 14,
    slug: "cotton-fatua-black",
    name: "Cotton Fatua - Black",
    nameBn: "কটন ফতুয়া - কালো",
    category: "fatua",
    categoryBn: "ফতুয়া",
    price: 580,
    originalPrice: 720,
    description: "Stylish black cotton fatua with modern collar design. Perfect casual wear for young men.",
    descriptionBn: "আধুনিক কলার ডিজাইন সহ স্টাইলিশ কালো কটন ফতুয়া। তরুণদের জন্য নিখুঁত ক্যাজুয়াল ওয়্যার।",
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=600&h=600&fit=crop"],
    inStock: true
  },
  {
    id: 15,
    slug: "silk-blouse-green",
    name: "Silk Blouse - Green",
    nameBn: "সিল্ক ব্লাউজ - সবুজ",
    category: "blouse",
    categoryBn: "ব্লাউজ",
    price: 750,
    originalPrice: 950,
    description: "Elegant green silk blouse with intricate embroidery. Perfect for wedding ceremonies.",
    descriptionBn: "জটিল এমব্রয়ডারি সহ এলিগ্যান্ট সবুজ সিল্ক ব্লাউজ। বিবাহের অনুষ্ঠানের জন্য উপযুক্ত।",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 16,
    slug: "kids-saree-yellow",
    name: "Kids Saree - Yellow",
    nameBn: "কিডস শাড়ি - হলুদ",
    category: "kids-saree",
    categoryBn: "কিডস শাড়ি",
    price: 580,
    originalPrice: 750,
    description: "Bright yellow saree for girls with floral border design. Lightweight and easy to drape.",
    descriptionBn: "ফুলের বর্ডার ডিজাইন সহ মেয়েদের জন্য উজ্জ্বল হলুদ শাড়ি। হালকা ওজনের এবং পরতে সহজ।",
    image: "https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=600&h=600&fit=crop"],
    inStock: true
  },
  {
    id: 17,
    slug: "hand-towel-set",
    name: "Hand Towel Set - 3 pcs",
    nameBn: "হ্যান্ড টাওয়েল সেট - ৩ পিস",
    category: "towel",
    categoryBn: "টাওয়েল",
    price: 450,
    description: "Set of 3 soft cotton hand towels in assorted colors. Perfect for bathroom and kitchen.",
    descriptionBn: "৩টি নরম কটন হ্যান্ড টাওয়েলের সেট বিভিন্ন রঙে। বাথরুম এবং রান্নাঘরের জন্য উপযুক্ত।",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop"],
    inStock: true,
    isBestSeller: true
  },
  {
    id: 18,
    slug: "single-mosquito-net",
    name: "Mosquito Net - Single Bed",
    nameBn: "মশারি - সিঙ্গেল বেড",
    category: "moshari",
    categoryBn: "মশারি",
    price: 550,
    originalPrice: 700,
    description: "Compact single bed mosquito net. Lightweight and easy to carry for travel.",
    descriptionBn: "কমপ্যাক্ট সিঙ্গেল বেড মশারি। হালকা ওজনের এবং ভ্রমণের জন্য সহজে বহনযোগ্য।",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=600&fit=crop"],
    inStock: true
  },
  {
    id: 19,
    slug: "petticoat-red",
    name: "Petticoat - Red",
    nameBn: "পেটিকোট - লাল",
    category: "petticoat",
    categoryBn: "পেটিকোট",
    price: 420,
    originalPrice: 520,
    description: "Vibrant red petticoat with lace border. Full volume design for traditional saree draping.",
    descriptionBn: "লেস বর্ডার সহ প্রাণবন্ত লাল পেটিকোট। ঐতিহ্যবাহী শাড়ি পরার জন্য ফুল ভলিউম ডিজাইন।",
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652b6?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652b6?w=600&h=600&fit=crop"],
    inStock: true
  },
  {
    id: 20,
    slug: "half-sleeve-pajama",
    name: "Half Sleeve Pajama - Sky Blue",
    nameBn: "হাফ স্লিভ পাজামা - স্কাই ব্লু",
    category: "pajama",
    categoryBn: "পাজামা",
    price: 350,
    originalPrice: 450,
    description: "Lightweight half sleeve pajama in sky blue. Great for hot summer days and casual wear.",
    descriptionBn: "স্কাই ব্লুতে হালকা ওজনের হাফ স্লিভ পাজামা। গরম গ্রীষ্মের দিন এবং ক্যাজুয়াল পরার জন্য দারুণ।",
    image: "https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=600&h=600&fit=crop"],
    inStock: true
  },
  {
    id: 21,
    slug: "embroidery-fatua-maroon",
    name: "Embroidery Fatua - Maroon",
    nameBn: "এমব্রয়ডারি ফতুয়া - মেরুন",
    category: "fatua",
    categoryBn: "ফতুয়া",
    price: 720,
    originalPrice: 900,
    description: "Maroon fatua with chest embroidery design. Premium fabric with a stylish modern look.",
    descriptionBn: "চেস্ট এমব্রয়ডারি ডিজাইন সহ মেরুন ফতুয়া। স্টাইলিশ আধুনিক লুক সহ প্রিমিয়াম ফেব্রিক।",
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true
  },
  {
    id: 22,
    slug: "printed-lungi-multi",
    name: "Printed Lungi - Multi Color",
    nameBn: "প্রিন্টেড লুঙ্গি - মাল্টি কালার",
    category: "lungi",
    categoryBn: "লুঙ্গি",
    price: 400,
    description: "Vibrant multi-color printed lungi with traditional motifs. Lightweight and breathable cotton.",
    descriptionBn: "ঐতিহ্যবাহী মোটিফ সহ প্রাণবন্ত মাল্টি-কালার প্রিন্টেড লুঙ্গি। হালকা এবং শ্বাস-প্রশ্বাসযোগ্য কটন।",
    image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&h=600&fit=crop"],
    inStock: true,
    isBestSeller: true
  },
  {
    id: 23,
    slug: "kids-saree-green",
    name: "Kids Saree - Green",
    nameBn: "কিডস শাড়ি - সবুজ",
    category: "kids-saree",
    categoryBn: "কিডস শাড়ি",
    price: 600,
    originalPrice: 780,
    description: "Beautiful green saree for girls with golden border and subtle print. Perfect for festivals.",
    descriptionBn: "গোল্ডেন বর্ডার এবং সূক্ষ্ম প্রিন্ট সহ মেয়েদের জন্য সুন্দর সবুজ শাড়ি। উৎসবের জন্য উপযুক্ত।",
    image: "https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=600&h=600&fit=crop"],
    inStock: true
  },
  {
    id: 24,
    slug: "premium-towel-large",
    name: "Premium Bath Towel - Large",
    nameBn: "প্রিমিয়াম বাথ টাওয়েল - লার্জ",
    category: "towel",
    categoryBn: "টাওয়েল",
    price: 550,
    originalPrice: 700,
    description: "Large size premium bath towel with high absorbency. 80x160 cm, 100% cotton.",
    descriptionBn: "উচ্চ শোষণক্ষমতা সহ বড় সাইজের প্রিমিয়াম বাথ টাওয়েল। ৮০x১৬০ সেমি, ১০০% কটন।",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop"],
    inStock: true
  },
  {
    id: 25,
    slug: "silk-panjabi-green",
    name: "Silk Panjabi - Green",
    nameBn: "সিল্ক পাঞ্জাবি - সবুজ",
    category: "panjabi",
    categoryBn: "পাঞ্জাবি",
    price: 2200,
    originalPrice: 2800,
    description: "Royal green silk panjabi with traditional button design. Premium quality for special occasions.",
    descriptionBn: "ঐতিহ্যবাহী বাটন ডিজাইন সহ রাজকীয় সবুজ সিল্ক পাঞ্জাবি। বিশেষ অনুষ্ঠানের জন্য প্রিমিয়াম কোয়ালিটি।",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"],
    inStock: true,
    isFeatured: true,
    isBestSeller: true
  }
]

export const categories = [
  { slug: "lungi", name: "Lungi", nameBn: "লুঙ্গি", image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop" },
  { slug: "panjabi", name: "Panjabi", nameBn: "পাঞ্জাবি", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=400&fit=crop" },
  { slug: "pajama", name: "Pajama", nameBn: "পাজামা", image: "https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=400&h=400&fit=crop" },
  { slug: "fatua", name: "Fatua", nameBn: "ফতুয়া", image: "https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=400&h=400&fit=crop" },
  { slug: "moshari", name: "Mosquito Net", nameBn: "মশারি", image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop" },
  { slug: "towel", name: "Towel", nameBn: "টাওয়েল", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop" },
  { slug: "blouse", name: "Blouse", nameBn: "ব্লাউজ", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop" },
  { slug: "petticoat", name: "Petticoat", nameBn: "পেটিকোট", image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652b6?w=400&h=400&fit=crop" },
  { slug: "kids-saree", name: "Kids Saree", nameBn: "কিডস শাড়ি", image: "https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=400&h=400&fit=crop" }
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured)
}

export function getBestSellerProducts(): Product[] {
  return products.filter(p => p.isBestSeller)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.nameBn.includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.categoryBn.includes(q)
  )
}
