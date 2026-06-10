"""Initialize database with categories, sample products, banners, admin user."""
from datetime import datetime
from models import (
    db, Admin, Category, Product, ProductVariant,
    Banner, Coupon, SiteSetting
)


CATEGORIES = [
    {"slug": "lungi", "name": "Lungi", "name_bn": "লুঙ্গি", "icon": "🩳", "image": "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop"},
    {"slug": "panjabi", "name": "Panjabi", "name_bn": "পাঞ্জাবি", "icon": "👔", "image": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=400&fit=crop"},
    {"slug": "pajama", "name": "Pajama", "name_bn": "পাজামা", "icon": "👖", "image": "https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=400&h=400&fit=crop"},
    {"slug": "fatua", "name": "Fatua", "name_bn": "ফতুয়া", "icon": "👕", "image": "https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=400&h=400&fit=crop"},
    {"slug": "moshari", "name": "Mosquito Net", "name_bn": "মশারি", "icon": "🛏️", "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop"},
    {"slug": "towel", "name": "Towel", "name_bn": "তাওয়াল", "icon": "🧖", "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop"},
    {"slug": "blouse", "name": "Blouse", "name_bn": "ব্লাউজ", "icon": "👚", "image": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop"},
    {"slug": "petticoat", "name": "Petticoat", "name_bn": "পেটিকোট", "icon": "👗", "image": "https://images.unsplash.com/photo-1618932260643-eee4a2f652b6?w=400&h=400&fit=crop"},
    {"slug": "kids-saree", "name": "Kids Saree", "name_bn": "বাচ্চাদের শাড়ি", "icon": "👧", "image": "https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=400&h=400&fit=crop"},
    {"slug": "others", "name": "Others", "name_bn": "অন্যান্য", "icon": "🧵", "image": "https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=400&h=400&fit=crop"},
]


# Sample products with realistic Bangladeshi clothing
PRODUCTS = [
    # Lungi
    {
        "slug": "premium-cotton-lungi-check", "name": "Premium Cotton Lungi (Check)", "name_bn": "প্রিমিয়াম সুতি লুঙ্গি (চেক)",
        "category": "lungi", "price": 450, "original_price": 550,
        "description": "Soft premium cotton lungi with classic check pattern. Comfortable for daily wear.",
        "description_bn": "নরম প্রিমিয়াম সুতি কাপড়ের ক্লাসিক চেক প্যাটার্নের লুঙ্গি। দৈনন্দিন ব্যবহারের জন্য আরামদায়ক।",
        "is_featured": True, "is_best_seller": True,
        "images": ["https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&h=800&fit=crop"],
        "stock": 50,
    },
    {
        "slug": "silk-lungi-traditional", "name": "Silk Blend Lungi", "name_bn": "সিল্ক মিশ্রিত লুঙ্গি",
        "category": "lungi", "price": 850, "original_price": 0,
        "description": "Premium silk-blend lungi for special occasions.",
        "description_bn": "বিশেষ অনুষ্ঠানের জন্য প্রিমিয়াম সিল্ক মিশ্রিত লুঙ্গি।",
        "is_featured": True,
        "images": ["https://images.unsplash.com/photo-1601244005535-a48d21d951ac?w=800&h=800&fit=crop"],
        "stock": 30,
    },
    # Panjabi
    {
        "slug": "white-cotton-panjabi", "name": "White Cotton Panjabi", "name_bn": "সাদা সুতি পাঞ্জাবি",
        "category": "panjabi", "price": 1200, "original_price": 1500,
        "description": "Classic white cotton panjabi for Eid and special occasions. Embroidered detail.",
        "description_bn": "ঈদ ও বিশেষ অনুষ্ঠানের জন্য ক্লাসিক সাদা সুতি পাঞ্জাবি। এমব্রয়ডারি ডিটেইল।",
        "is_featured": True, "is_best_seller": True,
        "images": ["https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&h=800&fit=crop"],
        "stock": 40,
    },
    {
        "slug": "punjabi-kids-festive", "name": "Kids Festive Panjabi", "name_bn": "বাচ্চাদের উৎসব পাঞ্জাবি",
        "category": "panjabi", "price": 800, "original_price": 0,
        "description": "Beautiful festive panjabi for kids. Comfortable and stylish.",
        "description_bn": "বাচ্চাদের জন্য সুন্দর উৎসব পাঞ্জাবি। আরামদায়ক ও স্টাইলিশ।",
        "is_featured": True,
        "images": ["https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&h=800&fit=crop"],
        "stock": 25,
    },
    # Pajama
    {
        "slug": "classic-white-pajama", "name": "Classic White Pajama", "name_bn": "ক্লাসিক সাদা পাজামা",
        "category": "pajama", "price": 550, "original_price": 0,
        "description": "Comfortable white pajama for prayer and casual wear.",
        "description_bn": "নামাজ ও সাধারণ ব্যবহারের জন্য আরামদায়ক সাদা পাজামা।",
        "is_best_seller": True,
        "images": ["https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=800&h=800&fit=crop"],
        "stock": 60,
    },
    # Fatua
    {
        "slug": "printed-fatua-casual", "name": "Printed Fatua Casual", "name_bn": "প্রিন্টেড ফতুয়া ক্যাজুয়াল",
        "category": "fatua", "price": 380, "original_price": 450,
        "description": "Trendy printed fatua for everyday comfort.",
        "description_bn": "দৈনন্দিন আরামের জন্য ট্রেন্ডি প্রিন্টেড ফতুয়া।",
        "is_featured": True,
        "images": ["https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=800&h=800&fit=crop"],
        "stock": 80,
    },
    # Moshari
    {
        "slug": "large-family-moshari", "name": "Large Family Mosquito Net", "name_bn": "বড় পরিবারের মশারি",
        "category": "moshari", "price": 1200, "original_price": 1500,
        "description": "Durable large mosquito net for the whole family. Easy to install.",
        "description_bn": "পুরো পরিবারের জন্য টেকসই বড় মশারি। সহজে স্থাপনযোগ্য।",
        "is_best_seller": True,
        "images": ["https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=800&fit=crop"],
        "stock": 20,
    },
    # Towel
    {
        "slug": "premium-bath-towel-set", "name": "Premium Bath Towel Set", "name_bn": "প্রিমিয়াম গোসলের তাওয়াল সেট",
        "category": "towel", "price": 950, "original_price": 1200,
        "description": "Soft, absorbent towel set (3 pieces). Premium cotton.",
        "description_bn": "নরম, শোষণক্ষম তাওয়াল সেট (৩টি)। প্রিমিয়াম সুতি।",
        "is_featured": True,
        "images": ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=800&fit=crop"],
        "stock": 35,
    },
    # Blouse
    {
        "slug": "designer-blouse-piece", "name": "Designer Blouse Piece", "name_bn": "ডিজাইনার ব্লাউজ পিস",
        "category": "blouse", "price": 650, "original_price": 0,
        "description": "Beautiful designer blouse fabric for stitching.",
        "description_bn": "সেলাইয়ের জন্য সুন্দর ডিজাইনার ব্লাউজ কাপড়।",
        "images": ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop"],
        "stock": 45,
    },
    # Kids Saree
    {
        "slug": "kids-saree-festive-pink", "name": "Kids Festive Saree (Pink)", "name_bn": "বাচ্চাদের উৎসব শাড়ি (গোলাপি)",
        "category": "kids-saree", "price": 1500, "original_price": 1800,
        "description": "Beautiful festive saree for little girls. Comes with blouse piece.",
        "description_bn": "ছোট মেয়েদের জন্য সুন্দর উৎসব শাড়ি। ব্লাউজ পিস সহ।",
        "is_featured": True, "is_best_seller": True,
        "images": ["https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=800&h=800&fit=crop"],
        "stock": 18,
    },
]


BANNERS = [
    {
        "title": "Eid Collection 2026",
        "title_bn": "ঈদ কালেকশন ২০২৬",
        "subtitle": "Premium Panjabi, Lungi & More",
        "subtitle_bn": "প্রিমিয়াম পাঞ্জাবি, লুঙ্গি ও আরও অনেক কিছু",
        "image": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1600&h=600&fit=crop",
        "link": "/category/panjabi",
        "position": "hero",
        "sort_order": 1,
    },
    {
        "title": "Free Delivery Above ৳2000",
        "title_bn": "৳২০০০ এর উপরে ফ্রি ডেলিভারি",
        "subtitle": "All across Bangladesh",
        "subtitle_bn": "সারা বাংলাদেশে",
        "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=600&fit=crop",
        "link": "/products",
        "position": "hero",
        "sort_order": 2,
    },
    {
        "title": "Family Mosquito Net Sale",
        "title_bn": "ফ্যামিলি মশারি সেল",
        "subtitle": "Save up to 20%",
        "subtitle_bn": "২০% পর্যন্ত ছাড়",
        "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1600&h=600&fit=crop",
        "link": "/category/moshari",
        "position": "hero",
        "sort_order": 3,
    },
]


def init_database(app):
    """Drop all tables, recreate, and seed data."""
    print("Dropping existing tables...")
    db.drop_all()
    print("Creating tables...")
    db.create_all()

    # Categories
    print(f"Seeding {len(CATEGORIES)} categories...")
    for i, cat in enumerate(CATEGORIES):
        c = Category(
            slug=cat["slug"],
            name=cat["name"],
            name_bn=cat["name_bn"],
            image=cat.get("image", ""),
            icon=cat.get("icon", ""),
            sort_order=i,
        )
        db.session.add(c)
    db.session.commit()

    # Products
    print(f"Seeding {len(PRODUCTS)} products...")
    for prod in PRODUCTS:
        cat = Category.query.filter_by(slug=prod["category"]).first()
        if not cat:
            continue
        import json
        p = Product(
            slug=prod["slug"],
            name=prod["name"],
            name_bn=prod["name_bn"],
            category_id=cat.id,
            price=prod["price"],
            original_price=prod.get("original_price", 0),
            description=prod["description"],
            description_bn=prod["description_bn"],
            images=json.dumps(prod.get("images", [])),
            in_stock=True,
            stock_count=prod.get("stock", 0),
            is_featured=prod.get("is_featured", False),
            is_best_seller=prod.get("is_best_seller", False),
        )
        db.session.add(p)
        db.session.flush()  # need p.id

        # Add some default variants for panjabi (sizes)
        if cat.slug == "panjabi":
            for size in ["38", "40", "42", "44"]:
                db.session.add(ProductVariant(
                    product_id=p.id, size=size, stock_count=10, is_active=True
                ))
        elif cat.slug == "lungi":
            for size in ["Free Size"]:
                db.session.add(ProductVariant(
                    product_id=p.id, size=size, stock_count=20, is_active=True
                ))
    db.session.commit()

    # Banners
    print(f"Seeding {len(BANNERS)} banners...")
    for b in BANNERS:
        banner = Banner(
            title=b["title"],
            title_bn=b["title_bn"],
            subtitle=b["subtitle"],
            subtitle_bn=b["subtitle_bn"],
            image=b["image"],
            link=b["link"],
            position=b["position"],
            sort_order=b["sort_order"],
            is_active=True,
        )
        db.session.add(banner)
    db.session.commit()

    # Default admin
    print("Creating default admin user...")
    admin = Admin.query.filter_by(email=app.config["ADMIN_EMAIL"]).first()
    if not admin:
        admin = Admin(
            email=app.config["ADMIN_EMAIL"],
            name="Owner",
            role="owner",
        )
        admin.set_password(app.config["ADMIN_PASSWORD"])
        db.session.add(admin)
        db.session.commit()
        print(f"  ✓ Admin: {app.config['ADMIN_EMAIL']} / {app.config['ADMIN_PASSWORD']}")
    else:
        print(f"  ✓ Admin exists: {app.config['ADMIN_EMAIL']}")

    # Default site settings
    print("Seeding site settings...")
    for key, val in [
        ("delivery_charge_inside", "60"),
        ("delivery_charge_outside", "120"),
        ("free_delivery_threshold", "2000"),
        ("store_hours", "সকাল ৯টা - রাত ৯টা"),
    ]:
        SiteSetting.set(key, val)

    print("\n✅ Database initialized!")
    print(f"  - {Category.query.count()} categories")
    print(f"  - {Product.query.count()} products")
    print(f"  - {ProductVariant.query.count()} variants")
    print(f"  - {Banner.query.count()} banners")
    print(f"  - {Admin.query.count()} admin(s)")


if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        init_database(app)
