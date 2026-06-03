-- ============================================
-- Lakshmipur Bostraloy - Supabase Schema
-- ============================================
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- 1. Create categories table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10,2) DEFAULT 0,
  description TEXT DEFAULT '',
  description_bn TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create orders table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  note TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create admins table
CREATE TABLE admins (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 6. Create policies (allow public read for products & categories)
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);

-- 7. Allow authenticated admin full access
CREATE POLICY "Allow admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- 8. Create storage bucket for product images
-- Run this in the SQL editor as well or use the Supabase dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- 9. Allow public read on storage
-- CREATE POLICY "Allow public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
-- CREATE POLICY "Allow admin upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 10. Seed default categories
INSERT INTO categories (slug, name, name_bn, image) VALUES
  ('lungi', 'Lungi', 'লুঙ্গি', 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop'),
  ('panjabi', 'Panjabi', 'পাঞ্জাবি', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=400&fit=crop'),
  ('pajama', 'Pajama', 'পাজামা', 'https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=400&h=400&fit=crop'),
  ('fatua', 'Fatua', 'ফতুয়া', 'https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=400&h=400&fit=crop'),
  ('moshari', 'Mosquito Net', 'মশারি', 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop'),
  ('towel', 'Towel', 'তাওয়াল', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop'),
  ('blouse', 'Blouse', 'ব্লাউজ', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop'),
  ('petticoat', 'Petticoat', 'পেটিকোট', 'https://images.unsplash.com/photo-1618932260643-eee4a2f652b6?w=400&h=400&fit=crop'),
  ('kids-saree', 'Kids Saree', 'বাচ্চাদের শাড়ি', 'https://images.unsplash.com/photo-1614607636972-5b6fa7b2b124?w=400&h=400&fit=crop'),
  ('others', 'Others', 'অন্যান্য', 'https://images.unsplash.com/photo-1556306535-0f09a537f0d3?w=400&h=400&fit=crop');

-- 11. Seed admin user (password: Admin@123456)
-- The password hash is generated for: Admin@123456
-- You can use this or create your own admin via the app's seed endpoint
INSERT INTO admins (email, password_hash)
VALUES ('admin@lakshmipurbostraloy.com', '$2a$10$YourHashHere')
ON CONFLICT (email) DO NOTHING;
