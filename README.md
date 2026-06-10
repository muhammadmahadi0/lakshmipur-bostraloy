# Lakshmipur Bostraloy — Traditional Bangladeshi Clothing E-commerce

> **Bilingual (বাংলা/English) e-commerce platform** for a Bangladeshi clothing shop, built with Flask + HTMX + Tailwind CSS.

![Status](https://img.shields.io/badge/status-MVP-yellow) ![Python](https://img.shields.io/badge/python-3.12+-blue) ![Flask](https://img.shields.io/badge/flask-3.1-green) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Features

### Storefront (Public)
- Home page with hero, categories, featured & best-seller products
- Product listing with category filter, search, sort (price/popularity)
- Live search (HTMX-powered autocomplete)
- Product detail with variants, image gallery, related products
- Cart (session-based, no login required)
- Checkout with multiple payment options (COD, bKash, Nagad, Rocket)
- Bilingual: Bangla (default) + English with one-click switcher
- Fully responsive mobile-first design
- WhatsApp integration throughout the site

### Admin Panel
- Secure login with hashed passwords (Werkzeug)
- Full CRUD for products, categories, orders, customers, banners, reviews, coupons
- Flask-Admin interface (auto-generated, beautiful)

### Technical
- Flask 3.1 with blueprints-ready structure
- SQLAlchemy ORM (SQLite default, PostgreSQL ready)
- HTMX for dynamic interactions without heavy JS
- Tailwind CSS via CDN (no build step)
- Babel for i18n
- CSRF protection via Flask-WTF
- Session-based cart (no login required)

---

## Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Initialize the database
```bash
python init_db.py
```
This creates `instance/bostraloy.db` with 10 categories, 10 sample products, banners, and a default admin user.

### 3. Run the development server
```bash
python app.py
```

### 4. Open in browser
- **Store**: http://localhost:5000
- **Admin panel**: http://localhost:5000/admin/
  - Email: `admin@lakshmipurbostraloy.com`
  - Password: `Admin@123456`

---

## Deploy on PythonAnywhere (Free)

1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com) (no credit card)
2. Open a **Bash** console and clone your repo:
   ```bash
   git clone https://github.com/muhammadmahadi0/lakshmipur-bostraloy.git
   ```
3. Create a virtualenv and install deps:
   ```bash
   cd lakshmipur-bostraloy
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. Initialize the database:
   ```bash
   python init_db.py
   ```
5. Go to the **Web** tab → **Add a new web app** → **Manual configuration** → **Python 3.12**
6. Set:
   - **Source code**: `/home/YOUR_USERNAME/lakshmipur-bostraloy`
   - **Working directory**: same
   - **Virtualenv**: `/home/YOUR_USERNAME/lakshmipur-bostraloy/venv`
   - **WSGI file**: Click the link and replace its contents with:
     ```python
     import sys
     sys.path.insert(0, '/home/YOUR_USERNAME/lakshmipur-bostraloy')
     from wsgi import app
     ```
7. Go to the **Web** tab → **Environment variables** and add:
   - `SECRET_KEY` → a long random string
   - `ADMIN_PASSWORD` → a secure password
8. Go back to **Web** tab and click **Reload**
9. Your site is live at `YOUR_USERNAME.pythonanywhere.com`
10. Visit `/admin/` and login with `admin@lakshmipurbostraloy.com` and your password

---

## Project Structure

```
bostraloy/
├── app.py                  # Main Flask app + routes
├── models.py               # SQLAlchemy models (11 tables)
├── admin.py                # Flask-Admin configuration
├── config.py               # Configuration (env-aware)
├── init_db.py              # Database seeder
├── wsgi.py                 # PythonAnywhere WSGI entry point
├── requirements.txt        # Python dependencies
├── instance/
│   └── bostraloy.db        # SQLite database (auto-created)
├── static/                 # CSS, JS, uploaded images
└── templates/              # Jinja2 templates
    ├── base.html           # Master layout (header, footer, nav)
    ├── index.html          # Home page
    ├── products.html       # Product listing + filters
    ├── product.html        # Product detail
    ├── cart.html           # Shopping cart
    ├── checkout.html       # Checkout flow
    ├── order_confirmation.html
    ├── about.html
    ├── admin_login.html
    ├── 404.html
    └── partials/
        └── product_card.html
```

---

## Database Schema (11 tables)

| Table | Purpose |
|---|---|
| `admins` | Admin users (owner/manager/staff) |
| `categories` | Product categories (bilingual) |
| `products` | Product catalog (Bangladeshi clothing) |
| `product_variants` | Size/color/SKU/stock per product |
| `customers` | Customer profiles (phone-indexed) |
| `orders` | Order header with status workflow |
| `order_items` | Line items (JSONB snapshot) |
| `banners` | Hero/sidebar/footer banners |
| `reviews` | Product reviews with approval |
| `coupons` | Discount codes (percent/flat) |
| `site_settings` | Key-value config |

---

## Routes

| Path | Method | Description |
|---|---|---|
| `/` | GET | Home page |
| `/products` | GET | Product listing (filter/search/sort) |
| `/category/<slug>` | GET | Category page (redirects to /products?category=) |
| `/product/<slug>` | GET | Product detail |
| `/cart` | GET | Shopping cart |
| `/checkout` | GET, POST | Checkout form |
| `/order/<number>` | GET | Order confirmation |
| `/about` | GET | About page |
| `/api/cart/add` | POST | Add to cart (HTMX) |
| `/api/cart/update` | POST | Update quantity |
| `/api/cart/remove` | POST | Remove item |
| `/api/coupon/apply` | POST | Apply coupon code |
| `/api/search` | GET | Live search (HTMX) |
| `/set-language/<lang>` | GET | Switch BN/EN |
| `/admin/` | GET | Flask-Admin dashboard |
| `/admin/login` | GET, POST | Admin login |

---

## Internationalization

- Default: বাংলা (Bangla)
- Switch with `/set-language/en` or `/set-language/bn`
- All UI strings wrapped in `{{ _('...') }}` for translation
- Currency: ৳ (Taka)

---

## Payment Methods (Bangladeshi standard)

- Cash on Delivery (COD) — default, fully working
- bKash — manual transfer (instructions shown)
- Nagad — manual transfer
- Rocket — manual transfer

---

## Security Notes

- Passwords hashed with `pbkdf2:sha256` (Werkzeug default)
- CSRF tokens on all forms
- SQL injection prevented (SQLAlchemy ORM)
- Admin routes protected by `login_required`
- Default admin password MUST be changed in production
- SECRET_KEY MUST be set via environment variable

---

## License

MIT — do whatever you want, no warranty.
