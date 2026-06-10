"""Main Flask app for Lakshmipur Bostraloy.

Routes:
- /                home
- /products        all products
- /category/<slug> category page
- /product/<slug>  product detail
- /cart            cart
- /checkout        checkout
- /order/<number>  order confirmation
- /api/*           HTMX endpoints (cart add/remove, search, etc.)
- /admin/*         Flask-Admin
- /admin/login     admin login
- /set-language/<lang>  switch BN/EN
"""
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, abort
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_babel import Babel, _, gettext
from pathlib import Path
from datetime import datetime
import os
import uuid
import json

from config import Config
from models import (
    db, Admin, Category, Product, ProductVariant,
    Customer, Order, Banner, Review, Coupon, SiteSetting
)
from admin import init_admin

# ============ App setup ============
app = Flask(__name__)
app.config.from_object(Config)
Config.UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

db.init_app(app)

# Babel for i18n (with simple shim — no .po files, just pass-through)
babel = Babel(app)


def get_locale():
    """Pick best language from session, browser, default."""
    if "lang" in session and session["lang"] in app.config["LANGUAGES"]:
        return session["lang"]
    return request.accept_languages.best_match(app.config["LANGUAGES"]) or app.config["DEFAULT_LANGUAGE"]


babel.init_app(app, locale_selector=get_locale)


# Simple translation shim — wraps gettext, falls back to original text
@app.template_filter("_")
def _(s):
    """Simple translation filter: passes through for now (i18n placeholder)."""
    if not s:
        return ""
    return str(s)


# Make gettext (Babel's) available in templates too, with simple passthrough
try:
    from flask_babel import gettext as babel_gettext
    @app.template_global("_gettext")
    def _gettext(s):
        return babel_gettext(s) if s else ""
except Exception:
    pass

# Login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "admin_login"


@login_manager.user_loader
def load_user(user_id):
    return Admin.query.get(int(user_id))


# Make config available in templates
@app.context_processor
def inject_globals():
    from models import Category
    try:
        nav_categories = Category.query.filter_by(is_active=True).order_by(Category.sort_order).all()
    except Exception:
        nav_categories = []
    return {
        "SHOP_NAME_BN": app.config["SHOP_NAME_BN"],
        "SHOP_NAME_EN": app.config["SHOP_NAME_EN"],
        "SHOP_PHONE": app.config["SHOP_PHONE"],
        "SHOP_WHATSAPP": app.config["SHOP_WHATSAPP"],
        "SHOP_ADDRESS_BN": app.config["SHOP_ADDRESS_BN"],
        "SHOP_ADDRESS_EN": app.config["SHOP_ADDRESS_EN"],
        "CURRENCY": app.config["CURRENCY"],
        "current_lang": session.get("lang", "bn"),
        "cart_count": cart_count(),
        "Category": Category,  # so templates can do Category.query
        "nav_categories": nav_categories,
    }


# ============ Cart helpers ============

def get_cart():
    """Return cart dict from session."""
    return session.get("cart", {})


def save_cart(cart):
    session["cart"] = cart
    session.modified = True


def cart_count():
    return sum(item["qty"] for item in get_cart().values())


def cart_subtotal():
    cart = get_cart()
    total = 0
    for key, item in cart.items():
        total += item["price"] * item["qty"]
    return total


# ============ Public routes ============

@app.route("/")
def home():
    lang = get_locale()
    categories = Category.query.filter_by(is_active=True).order_by(Category.sort_order).all()
    featured = Product.query.filter_by(is_featured=True, in_stock=True).limit(8).all()
    best_sellers = Product.query.filter_by(is_best_seller=True, in_stock=True).limit(8).all()
    banners = Banner.query.filter_by(is_active=True, position="hero").order_by(Banner.sort_order).limit(3).all()
    return render_template("index.html",
                         categories=categories,
                         featured=featured,
                         best_sellers=best_sellers,
                         banners=banners,
                         lang=lang)


@app.route("/products")
def products():
    lang = get_locale()
    category_slug = request.args.get("category")
    search = request.args.get("q", "").strip()
    sort = request.args.get("sort", "newest")

    query = Product.query.filter_by(in_stock=True)
    if category_slug:
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter_by(category_id=cat.id)
    if search:
        like = f"%{search}%"
        query = query.filter(db.or_(
            Product.name.ilike(like),
            Product.name_bn.ilike(like),
            Product.description.ilike(like),
        ))

    if sort == "price-low":
        query = query.order_by(Product.price.asc())
    elif sort == "price-high":
        query = query.order_by(Product.price.desc())
    elif sort == "popular":
        query = query.order_by(Product.view_count.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    products = query.all()
    categories = Category.query.filter_by(is_active=True).order_by(Category.sort_order).all()
    return render_template("products.html",
                         products=products,
                         categories=categories,
                         current_category=category_slug,
                         search=search,
                         sort=sort,
                         lang=lang)


@app.route("/category/<slug>")
def category(slug):
    return redirect(url_for("products", category=slug))


@app.route("/product/<slug>")
def product_detail(slug):
    lang = get_locale()
    product = Product.query.filter_by(slug=slug).first_or_404()
    # Track view
    product.view_count = (product.view_count or 0) + 1
    db.session.commit()
    related = Product.query.filter(
        Product.category_id == product.category_id,
        Product.id != product.id
    ).limit(4).all()
    return render_template("product.html", product=product, related=related, lang=lang)


# ============ Cart routes ============

@app.route("/cart")
def cart_view():
    lang = get_locale()
    cart = get_cart()
    # Hydrate product data
    items = []
    subtotal = 0
    for key, item in cart.items():
        p = Product.query.get(item["product_id"])
        if not p:
            continue
        line_total = p.price * item["qty"]
        subtotal += line_total
        items.append({
            "key": key,
            "product": p,
            "qty": item["qty"],
            "size": item.get("size", ""),
            "color": item.get("color", ""),
            "line_total": line_total,
        })
    return render_template("cart.html", items=items, subtotal=subtotal, lang=lang)


@app.route("/api/cart/add", methods=["POST"])
def cart_add():
    """Add to cart. HTMX-friendly."""
    product_id = request.form.get("product_id", type=int)
    qty = request.form.get("qty", 1, type=int)
    size = request.form.get("size", "").strip()
    color = request.form.get("color", "").strip()

    product = Product.query.get_or_404(product_id)
    key = f"{product_id}:{size}:{color}"
    cart = get_cart()
    if key in cart:
        cart[key]["qty"] += qty
    else:
        cart[key] = {
            "product_id": product_id,
            "qty": qty,
            "size": size,
            "color": color,
            "price": product.price,
            "name": product.name_bn,
        }
    save_cart(cart)

    # If HTMX request, return updated cart count
    if request.headers.get("HX-Request"):
        html = f'<span id="cart-count" class="badge bg-red-500 text-white text-xs">{cart_count()}</span>'
        # Also trigger toast
        response = f'<span id="cart-count">{cart_count()}</span>'
        return response
    return redirect(url_for("cart_view"))


@app.route("/api/cart/update", methods=["POST"])
def cart_update():
    key = request.form.get("key")
    qty = request.form.get("qty", 1, type=int)
    cart = get_cart()
    if key in cart:
        if qty <= 0:
            del cart[key]
        else:
            cart[key]["qty"] = qty
        save_cart(cart)
    if request.headers.get("HX-Request"):
        return redirect(url_for("cart_view"))
    return redirect(url_for("cart_view"))


@app.route("/api/cart/remove", methods=["POST"])
def cart_remove():
    key = request.form.get("key")
    cart = get_cart()
    if key in cart:
        del cart[key]
        save_cart(cart)
    return redirect(url_for("cart_view"))


# ============ Checkout ============

@app.route("/checkout", methods=["GET", "POST"])
def checkout():
    lang = get_locale()
    cart = get_cart()
    if not cart:
        flash(_("Your cart is empty") if lang == "en" else "আপনার কার্ট খালি", "warning")
        return redirect(url_for("cart_view"))

    items = []
    subtotal = 0
    for key, item in cart.items():
        p = Product.query.get(item["product_id"])
        if not p:
            continue
        line_total = p.price * item["qty"]
        subtotal += line_total
        items.append({
            "key": key,
            "product": p,
            "qty": item["qty"],
            "size": item.get("size", ""),
            "color": item.get("color", ""),
            "line_total": line_total,
        })

    shipping = 60 if subtotal < 2000 else 0
    discount = 0
    coupon_code = session.get("coupon_code", "")
    if coupon_code:
        coupon = Coupon.query.filter_by(code=coupon_code, is_active=True).first()
        if coupon:
            ok, _ = coupon.is_valid(subtotal)
            if ok:
                discount = coupon.calculate_discount(subtotal)
    total = subtotal + shipping - discount

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        phone = request.form.get("phone", "").strip()
        address = request.form.get("address", "").strip()
        note = request.form.get("note", "").strip()
        payment = request.form.get("payment", "cod")

        if not (name and phone and address):
            flash(_("Please fill all required fields") if lang == "en" else "সব তথ্য পূরণ করুন", "error")
            return render_template("checkout.html", items=items, subtotal=subtotal,
                                 shipping=shipping, discount=discount, total=total,
                                 coupon_code=coupon_code, lang=lang)

        # Find or create customer
        customer = Customer.query.filter_by(phone=phone).first()
        if not customer:
            customer = Customer(name=name, phone=phone, address=address)
            db.session.add(customer)
            db.session.flush()

        # Create order
        order_number = "LB" + datetime.now().strftime("%y%m%d") + str(uuid.uuid4().hex[:4]).upper()
        order = Order(
            order_number=order_number,
            customer_id=customer.id,
            customer_name=name,
            customer_phone=phone,
            customer_address=address,
            note=note,
            payment_method=payment,
            subtotal=subtotal,
            shipping=shipping,
            discount=discount,
            total=total,
            status="pending",
        )
        order.set_items([{
            "product_id": i["product"].id,
            "name": i["product"].name_bn,
            "qty": i["qty"],
            "size": i["size"],
            "color": i["color"],
            "price": i["product"].price,
            "line_total": i["line_total"],
        } for i in items])
        order.add_status("pending", "Order placed")
        db.session.add(order)
        db.session.commit()

        # Clear cart and coupon
        save_cart({})
        session.pop("coupon_code", None)

        return redirect(url_for("order_confirmation", number=order_number))

    return render_template("checkout.html", items=items, subtotal=subtotal,
                         shipping=shipping, discount=discount, total=total,
                         coupon_code=coupon_code, lang=lang)


@app.route("/api/coupon/apply", methods=["POST"])
def apply_coupon():
    code = request.form.get("code", "").strip().upper()
    coupon = Coupon.query.filter_by(code=code, is_active=True).first()
    if not coupon:
        return jsonify({"ok": False, "error": "Invalid coupon code"}), 400
    ok, msg = coupon.is_valid(cart_subtotal())
    if not ok:
        return jsonify({"ok": False, "error": msg}), 400
    session["coupon_code"] = code
    return jsonify({"ok": True, "message": "Coupon applied", "discount": coupon.calculate_discount(cart_subtotal())})


@app.route("/order/<number>")
def order_confirmation(number):
    lang = get_locale()
    order = Order.query.filter_by(order_number=number).first_or_404()
    return render_template("order_confirmation.html", order=order, lang=lang)


# ============ Language switcher ============

@app.route("/set-language/<lang>")
def set_language(lang):
    if lang in app.config["LANGUAGES"]:
        session["lang"] = lang
    return redirect(request.referrer or url_for("home"))


# ============ About ============

@app.route("/about")
def about():
    lang = get_locale()
    return render_template("about.html", lang=lang)


# ============ Search (HTMX) ============

@app.route("/api/search")
def search():
    q = request.args.get("q", "").strip()
    if not q or len(q) < 2:
        return ""
    like = f"%{q}%"
    products = Product.query.filter(
        db.or_(Product.name.ilike(like), Product.name_bn.ilike(like))
    ).limit(8).all()
    if not products:
        return '<div class="p-4 text-gray-500 text-sm">কোন পণ্য পাওয়া যায়নি</div>'
    html = '<div class="divide-y">'
    for p in products:
        html += f'''
        <a href="/product/{p.slug}" class="flex items-center gap-3 p-3 hover:bg-gray-50">
          <img src="{p.get_images()[0] if p.get_images() else '/static/placeholder.png'}" class="w-12 h-12 object-cover rounded">
          <div class="flex-1">
            <div class="font-medium text-sm">{p.name_bn}</div>
            <div class="text-xs text-gray-500">{p.name}</div>
          </div>
          <div class="font-bold text-green-700">৳{p.price:.0f}</div>
        </a>'''
    html += '</div>'
    return html


# ============ Admin routes ============

@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        admin = Admin.query.filter_by(email=email).first()
        if admin and admin.check_password(password):
            admin.last_login = datetime.utcnow()
            db.session.commit()
            login_user(admin)
            return redirect("/admin/")
        flash("Invalid credentials", "error")
    return render_template("admin_login.html")


@app.route("/admin/logout")
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for("admin_login"))


# ============ Error handlers ============

@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404


# ============ CLI commands ============

@app.cli.command("init-db")
def init_db_cmd():
    """Initialize database with tables and seed data."""
    from init_db import init_database
    init_database(app)
    print("✅ Database initialized and seeded")


@app.cli.command("create-admin")
def create_admin_cmd():
    """Create admin user."""
    email = input("Email: ").strip().lower()
    password = input("Password: ")
    name = input("Name [Admin]: ").strip() or "Admin"
    admin = Admin.query.filter_by(email=email).first()
    if admin:
        admin.set_password(password)
        admin.name = name
    else:
        admin = Admin(email=email, name=name, role="owner")
        admin.set_password(password)
        db.session.add(admin)
    db.session.commit()
    print(f"✅ Admin {email} created/updated")


# Register custom admin blueprint
init_admin(app)


# ============ Boot ============

def create_app():
    with app.app_context():
        db.create_all()
    return app


# Initialize tables on import (for gunicorn/production)
create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
