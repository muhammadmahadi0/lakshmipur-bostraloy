"""Custom admin blueprint for Lakshmipur Bostraloy.

Flask-Admin has version compat issues with the modern SQLAlchemy + Flask
combination, so we build a clean custom admin with the same CRUD surface
but full control over template, layout, and behavior.

Routes:
- /admin/                  dashboard
- /admin/products/         list
- /admin/products/new/     create
- /admin/products/<id>/    edit
- /admin/products/<id>/delete/
- /admin/categories/...    same pattern
- /admin/orders/...        same pattern
- /admin/customers/        list
- /admin/banners/...       same pattern
- /admin/coupons/...       same pattern
- /admin/settings/         key-value editor
- /admin/logout/           logout
"""
from functools import wraps
from flask import (
    Blueprint, render_template, request, redirect, url_for, flash, jsonify,
    abort, current_app
)
from flask_login import login_user, logout_user, login_required, current_user
from markupsafe import Markup
from datetime import datetime
import json

from models import (
    db, Admin, Category, Product, ProductVariant,
    Customer, Order, Banner, Review, Coupon, SiteSetting
)

admin_bp = Blueprint(
    "custom_admin",
    __name__,
    url_prefix="/admin",
    template_folder="templates/admin",
)


# ---------- Auth gate ----------

def admin_required(f):
    @wraps(f)
    @login_required
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for("custom_admin.login"))
        return f(*args, **kwargs)
    return wrapper


@admin_bp.route("/login/", methods=["GET", "POST"])
def login():
    # Already logged in? Go to dashboard.
    if current_user.is_authenticated:
        return redirect(url_for("custom_admin.dashboard"))

    if request.method == "POST":
        email = (request.form.get("email") or "").strip().lower()
        password = request.form.get("password") or ""
        admin = Admin.query.filter_by(email=email).first()
        if admin and admin.check_password(password):
            login_user(admin, remember=True)
            admin.last_login = datetime.utcnow()
            db.session.commit()
            next_url = request.args.get("next") or url_for("custom_admin.dashboard")
            return redirect(next_url)
        flash("ইমেইল অথবা পাসওয়ার্ড ভুল / Invalid email or password", "error")

    return render_template("admin/login.html")


@admin_bp.route("/logout/")
@login_required
def logout():
    logout_user()
    flash("আপনি লগআউট হয়েছেন / You have been logged out", "info")
    return redirect(url_for("custom_admin.login"))


# ---------- Dashboard ----------

@admin_bp.route("/")
@admin_required
def dashboard():
    stats = {
        "total_products": Product.query.filter_by(is_active=True).count(),
        "total_categories": Category.query.filter_by(is_active=True).count(),
        "total_orders": Order.query.count(),
        "total_customers": Customer.query.count(),
        "total_revenue": db.session.query(db.func.sum(Order.total)).filter(
            Order.status == "delivered"
        ).scalar() or 0,
        "pending_orders": Order.query.filter_by(status="pending").count(),
        "low_stock": Product.query.filter(
            Product.is_active == True,
            Product.stock_count < 5
        ).count(),
    }
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
    top_products = Product.query.filter_by(is_active=True).order_by(
        Product.view_count.desc()
    ).limit(5).all()

    return render_template(
        "admin/dashboard.html",
        stats=stats,
        recent_orders=recent_orders,
        top_products=top_products,
    )


# ---------- Generic CRUD helpers ----------

def parse_json_field(value, default=None):
    """Parse a JSON/text field. Returns list/dict or default."""
    if not value:
        return default if default is not None else []
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return default if default is not None else []


def slugify(text):
    import re
    text = (text or "").lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


# ---------- Products ----------

@admin_bp.route("/products/")
@admin_required
def products_list():
    page = request.args.get("page", 1, type=int)
    search = request.args.get("q", "").strip()
    category_id = request.args.get("category", type=int)

    query = Product.query
    if search:
        query = query.filter(
            db.or_(
                Product.name.ilike(f"%{search}%"),
                Product.name_bn.ilike(f"%{search}%"),
                Product.slug.ilike(f"%{search}%"),
            )
        )
    if category_id:
        query = query.filter_by(category_id=category_id)

    products = query.order_by(Product.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False
    )
    categories = Category.query.filter_by(is_active=True).order_by(Category.name).all()

    return render_template(
        "admin/products_list.html",
        products=products,
        categories=categories,
        search=search,
        current_category=category_id,
    )


@admin_bp.route("/products/new/", methods=["GET", "POST"])
@admin_required
def product_new():
    categories = Category.query.filter_by(is_active=True).order_by(Category.name).all()

    if request.method == "POST":
        try:
            slug = request.form.get("slug", "").strip() or slugify(request.form.get("name", ""))
            if not slug:
                slug = f"product-{int(datetime.utcnow().timestamp())}"
            # Ensure unique slug
            base_slug = slug
            i = 1
            while Product.query.filter_by(slug=slug).first():
                i += 1
                slug = f"{base_slug}-{i}"

            images_raw = request.form.get("images", "[]")
            try:
                images = json.loads(images_raw) if images_raw else []
            except json.JSONDecodeError:
                images = [line.strip() for line in images_raw.splitlines() if line.strip()]

            product = Product(
                name=request.form.get("name", "").strip(),
                name_bn=request.form.get("name_bn", "").strip() or request.form.get("name", ""),
                slug=slug,
                category_id=int(request.form.get("category_id")),
                price=float(request.form.get("price", 0) or 0),
                original_price=float(request.form.get("original_price", 0) or 0),
                description=request.form.get("description", ""),
                description_bn=request.form.get("description_bn", ""),
                images=json.dumps(images, ensure_ascii=False),
                stock_count=int(request.form.get("stock_count", 0) or 0),
                in_stock=bool(int(request.form.get("stock_count", 0) or 0)),
                is_active=bool(request.form.get("is_active")),
                is_featured=bool(request.form.get("is_featured")),
                is_best_seller=bool(request.form.get("is_best_seller")),
            )
            db.session.add(product)
            db.session.commit()
            flash(f"Product '{product.name}' created.", "success")
            return redirect(url_for("custom_admin.product_edit", product_id=product.id))
        except Exception as e:
            db.session.rollback()
            flash(f"Error creating product: {e}", "error")

    return render_template("admin/product_form.html", product=None, categories=categories)


@admin_bp.route("/products/<int:product_id>/", methods=["GET", "POST"])
@admin_required
def product_edit(product_id):
    product = Product.query.get_or_404(product_id)
    categories = Category.query.filter_by(is_active=True).order_by(Category.name).all()

    if request.method == "POST":
        try:
            new_slug = request.form.get("slug", "").strip() or slugify(request.form.get("name", ""))
            if new_slug != product.slug:
                base_slug = new_slug
                i = 1
                while Product.query.filter(Product.slug == new_slug, Product.id != product.id).first():
                    i += 1
                    new_slug = f"{base_slug}-{i}"
                product.slug = new_slug

            images_raw = request.form.get("images", "[]")
            try:
                images = json.loads(images_raw) if images_raw else []
            except json.JSONDecodeError:
                images = [line.strip() for line in images_raw.splitlines() if line.strip()]

            product.name = request.form.get("name", "").strip()
            product.name_bn = request.form.get("name_bn", "").strip() or product.name
            product.category_id = int(request.form.get("category_id"))
            product.price = float(request.form.get("price", 0) or 0)
            product.original_price = float(request.form.get("original_price", 0) or 0)
            product.description = request.form.get("description", "")
            product.description_bn = request.form.get("description_bn", "")
            product.images = json.dumps(images, ensure_ascii=False)
            product.stock_count = int(request.form.get("stock_count", 0) or 0)
            product.in_stock = product.stock_count > 0
            product.is_active = bool(request.form.get("is_active"))
            product.is_featured = bool(request.form.get("is_featured"))
            product.is_best_seller = bool(request.form.get("is_best_seller"))

            db.session.commit()
            flash(f"Product '{product.name}' updated.", "success")
            return redirect(url_for("custom_admin.product_edit", product_id=product.id))
        except Exception as e:
            db.session.rollback()
            flash(f"Error updating product: {e}", "error")

    return render_template("admin/product_form.html", product=product, categories=categories)


@admin_bp.route("/products/<int:product_id>/delete/", methods=["POST"])
@admin_required
def product_delete(product_id):
    product = Product.query.get_or_404(product_id)
    name = product.name
    db.session.delete(product)
    db.session.commit()
    flash(f"Product '{name}' deleted.", "info")
    return redirect(url_for("custom_admin.products_list"))


# ---------- Variants (per product) ----------

@admin_bp.route("/products/<int:product_id>/variants/", methods=["GET", "POST"])
@admin_required
def product_variants(product_id):
    product = Product.query.get_or_404(product_id)

    if request.method == "POST":
        try:
            variant = ProductVariant(
                product_id=product.id,
                size=request.form.get("size", "").strip(),
                color=request.form.get("color", "").strip(),
                sku=request.form.get("sku", "").strip(),
                price_override=float(request.form.get("price_override", 0) or 0),
                stock_count=int(request.form.get("stock_count", 0) or 0),
            )
            db.session.add(variant)
            db.session.commit()
            flash(f"Variant added.", "success")
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
        return redirect(url_for("custom_admin.product_variants", product_id=product.id))

    variants = ProductVariant.query.filter_by(product_id=product.id).all()
    return render_template("admin/product_variants.html", product=product, variants=variants)


@admin_bp.route("/variants/<int:variant_id>/delete/", methods=["POST"])
@admin_required
def variant_delete(variant_id):
    variant = ProductVariant.query.get_or_404(variant_id)
    product_id = variant.product_id
    db.session.delete(variant)
    db.session.commit()
    flash("Variant removed.", "info")
    return redirect(url_for("custom_admin.product_variants", product_id=product_id))


# ---------- Categories ----------

@admin_bp.route("/categories/")
@admin_required
def categories_list():
    categories = Category.query.order_by(Category.sort_order, Category.name).all()
    return render_template("admin/categories_list.html", categories=categories)


@admin_bp.route("/categories/new/", methods=["GET", "POST"])
@admin_required
def category_new():
    if request.method == "POST":
        try:
            slug = request.form.get("slug", "").strip() or slugify(request.form.get("name", ""))
            base_slug = slug
            i = 1
            while Category.query.filter_by(slug=slug).first():
                i += 1
                slug = f"{base_slug}-{i}"
            cat = Category(
                name=request.form.get("name", "").strip(),
                name_bn=request.form.get("name_bn", "").strip() or request.form.get("name", ""),
                slug=slug,
                description=request.form.get("description", ""),
                description_bn=request.form.get("description_bn", ""),
                image=request.form.get("image", ""),
                icon=request.form.get("icon", ""),
                sort_order=int(request.form.get("sort_order", 0) or 0),
                is_active=bool(request.form.get("is_active", True)),
            )
            db.session.add(cat)
            db.session.commit()
            flash(f"Category '{cat.name}' created.", "success")
            return redirect(url_for("custom_admin.categories_list"))
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
    return render_template("admin/category_form.html", category=None)


@admin_bp.route("/categories/<int:category_id>/", methods=["GET", "POST"])
@admin_required
def category_edit(category_id):
    category = Category.query.get_or_404(category_id)
    if request.method == "POST":
        try:
            category.name = request.form.get("name", "").strip()
            category.name_bn = request.form.get("name_bn", "").strip() or category.name
            category.description = request.form.get("description", "")
            category.description_bn = request.form.get("description_bn", "")
            category.image = request.form.get("image", "")
            category.icon = request.form.get("icon", "")
            category.sort_order = int(request.form.get("sort_order", 0) or 0)
            category.is_active = bool(request.form.get("is_active", True))
            db.session.commit()
            flash(f"Category updated.", "success")
            return redirect(url_for("custom_admin.categories_list"))
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
    return render_template("admin/category_form.html", category=category)


@admin_bp.route("/categories/<int:category_id>/delete/", methods=["POST"])
@admin_required
def category_delete(category_id):
    category = Category.query.get_or_404(category_id)
    name = category.name
    db.session.delete(category)
    db.session.commit()
    flash(f"Category '{name}' deleted.", "info")
    return redirect(url_for("custom_admin.categories_list"))


# ---------- Orders ----------

@admin_bp.route("/orders/")
@admin_required
def orders_list():
    page = request.args.get("page", 1, type=int)
    status_filter = request.args.get("status", "")

    query = Order.query
    if status_filter:
        query = query.filter_by(status=status_filter)

    orders = query.order_by(Order.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template(
        "admin/orders_list.html",
        orders=orders,
        status_filter=status_filter,
    )


@admin_bp.route("/orders/<int:order_id>/", methods=["GET", "POST"])
@admin_required
def order_detail(order_id):
    order = Order.query.get_or_404(order_id)
    if request.method == "POST":
        try:
            new_status = request.form.get("status")
            if new_status in ["pending", "confirmed", "shipped", "delivered", "cancelled"]:
                order.status = new_status
            order.notes = request.form.get("notes", "")
            db.session.commit()
            flash(f"Order {order.order_number} updated.", "success")
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
    return render_template("admin/order_detail.html", order=order)


# ---------- Customers ----------

@admin_bp.route("/customers/")
@admin_required
def customers_list():
    page = request.args.get("page", 1, type=int)
    customers = Customer.query.order_by(Customer.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False
    )
    return render_template("admin/customers_list.html", customers=customers)


@admin_bp.route("/customers/<int:customer_id>/")
@admin_required
def customer_detail(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    orders = customer.orders.order_by(Order.created_at.desc()).all()
    return render_template("admin/customer_detail.html", customer=customer, orders=orders)


# ---------- Banners ----------

@admin_bp.route("/banners/")
@admin_required
def banners_list():
    banners = Banner.query.order_by(Banner.sort_order).all()
    return render_template("admin/banners_list.html", banners=banners)


@admin_bp.route("/banners/new/", methods=["GET", "POST"])
@admin_required
def banner_new():
    if request.method == "POST":
        try:
            banner = Banner(
                title=request.form.get("title", "").strip(),
                title_bn=request.form.get("title_bn", "").strip() or request.form.get("title", ""),
                subtitle=request.form.get("subtitle", ""),
                subtitle_bn=request.form.get("subtitle_bn", ""),
                image_url=request.form.get("image_url", ""),
                link_url=request.form.get("link_url", ""),
                button_text=request.form.get("button_text", "Shop Now"),
                button_text_bn=request.form.get("button_text_bn", "এখনই কিনুন"),
                sort_order=int(request.form.get("sort_order", 0) or 0),
                is_active=bool(request.form.get("is_active", True)),
            )
            db.session.add(banner)
            db.session.commit()
            flash("Banner created.", "success")
            return redirect(url_for("custom_admin.banners_list"))
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
    return render_template("admin/banner_form.html", banner=None)


@admin_bp.route("/banners/<int:banner_id>/", methods=["GET", "POST"])
@admin_required
def banner_edit(banner_id):
    banner = Banner.query.get_or_404(banner_id)
    if request.method == "POST":
        try:
            banner.title = request.form.get("title", "").strip()
            banner.title_bn = request.form.get("title_bn", "").strip() or banner.title
            banner.subtitle = request.form.get("subtitle", "")
            banner.subtitle_bn = request.form.get("subtitle_bn", "")
            banner.image_url = request.form.get("image_url", "")
            banner.link_url = request.form.get("link_url", "")
            banner.button_text = request.form.get("button_text", "Shop Now")
            banner.button_text_bn = request.form.get("button_text_bn", "এখনই কিনুন")
            banner.sort_order = int(request.form.get("sort_order", 0) or 0)
            banner.is_active = bool(request.form.get("is_active", True))
            db.session.commit()
            flash("Banner updated.", "success")
            return redirect(url_for("custom_admin.banners_list"))
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
    return render_template("admin/banner_form.html", banner=banner)


@admin_bp.route("/banners/<int:banner_id>/delete/", methods=["POST"])
@admin_required
def banner_delete(banner_id):
    banner = Banner.query.get_or_404(banner_id)
    db.session.delete(banner)
    db.session.commit()
    flash("Banner deleted.", "info")
    return redirect(url_for("custom_admin.banners_list"))


# ---------- Coupons ----------

@admin_bp.route("/coupons/")
@admin_required
def coupons_list():
    coupons = Coupon.query.order_by(Coupon.created_at.desc()).all()
    return render_template("admin/coupons_list.html", coupons=coupons)


@admin_bp.route("/coupons/new/", methods=["GET", "POST"])
@admin_required
def coupon_new():
    if request.method == "POST":
        try:
            expires_at_raw = request.form.get("expires_at", "").strip()
            expires_at = None
            if expires_at_raw:
                try:
                    expires_at = datetime.fromisoformat(expires_at_raw)
                except ValueError:
                    expires_at = None

            coupon = Coupon(
                code=request.form.get("code", "").strip().upper(),
                description=request.form.get("description", ""),
                discount_type=request.form.get("discount_type", "percent"),
                discount_value=float(request.form.get("discount_value", 0) or 0),
                min_order=float(request.form.get("min_order", 0) or 0),
                max_uses=int(request.form.get("max_uses", 0) or 0),
                is_active=bool(request.form.get("is_active", True)),
                expires_at=expires_at,
            )
            db.session.add(coupon)
            db.session.commit()
            flash(f"Coupon '{coupon.code}' created.", "success")
            return redirect(url_for("custom_admin.coupons_list"))
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
    return render_template("admin/coupon_form.html", coupon=None)


@admin_bp.route("/coupons/<int:coupon_id>/", methods=["GET", "POST"])
@admin_required
def coupon_edit(coupon_id):
    coupon = Coupon.query.get_or_404(coupon_id)
    if request.method == "POST":
        try:
            coupon.code = request.form.get("code", "").strip().upper()
            coupon.description = request.form.get("description", "")
            coupon.discount_type = request.form.get("discount_type", "percent")
            coupon.discount_value = float(request.form.get("discount_value", 0) or 0)
            coupon.min_order = float(request.form.get("min_order", 0) or 0)
            coupon.max_uses = int(request.form.get("max_uses", 0) or 0)
            coupon.is_active = bool(request.form.get("is_active", True))
            expires_at_raw = request.form.get("expires_at", "").strip()
            if expires_at_raw:
                try:
                    coupon.expires_at = datetime.fromisoformat(expires_at_raw)
                except ValueError:
                    pass
            else:
                coupon.expires_at = None
            db.session.commit()
            flash("Coupon updated.", "success")
            return redirect(url_for("custom_admin.coupons_list"))
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
    return render_template("admin/coupon_form.html", coupon=coupon)


@admin_bp.route("/coupons/<int:coupon_id>/delete/", methods=["POST"])
@admin_required
def coupon_delete(coupon_id):
    coupon = Coupon.query.get_or_404(coupon_id)
    db.session.delete(coupon)
    db.session.commit()
    flash("Coupon deleted.", "info")
    return redirect(url_for("custom_admin.coupons_list"))


# ---------- Settings ----------

@admin_bp.route("/settings/", methods=["GET", "POST"])
@admin_required
def settings():
    if request.method == "POST":
        try:
            for key, value in request.form.items():
                if key.startswith("_"):  # CSRF or similar
                    continue
                setting = SiteSetting.query.filter_by(key=key).first()
                if setting:
                    setting.value = value
                    setting.updated_at = datetime.utcnow()
                else:
                    setting = SiteSetting(key=key, value=value)
                    db.session.add(setting)
            db.session.commit()
            flash("Settings saved.", "success")
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
        return redirect(url_for("custom_admin.settings"))

    settings_list = SiteSetting.query.order_by(SiteSetting.key).all()
    return render_template("admin/settings.html", settings=settings_list)


# ---------- Admin users ----------

@admin_bp.route("/admins/")
@admin_required
def admins_list():
    admins = Admin.query.order_by(Admin.created_at).all()
    return render_template("admin/admins_list.html", admins=admins)


@admin_bp.route("/admins/new/", methods=["GET", "POST"])
@admin_required
def admin_new():
    if request.method == "POST":
        try:
            email = (request.form.get("email") or "").strip().lower()
            password = request.form.get("password") or ""
            name = request.form.get("name", "Admin").strip() or "Admin"
            role = request.form.get("role", "staff")

            if not email or not password:
                flash("Email and password required.", "error")
                return redirect(url_for("custom_admin.admin_new"))

            if Admin.query.filter_by(email=email).first():
                flash("Email already exists.", "error")
                return redirect(url_for("custom_admin.admin_new"))

            admin = Admin(email=email, name=name, role=role, enabled=True)
            admin.set_password(password)
            db.session.add(admin)
            db.session.commit()
            flash(f"Admin {email} created.", "success")
            return redirect(url_for("custom_admin.admins_list"))
        except Exception as e:
            db.session.rollback()
            flash(f"Error: {e}", "error")
    return render_template("admin/admin_form.html", admin=None)


@admin_bp.route("/admins/<int:admin_id>/delete/", methods=["POST"])
@admin_required
def admin_delete(admin_id):
    if admin_id == current_user.id:
        flash("You cannot delete your own account.", "error")
        return redirect(url_for("custom_admin.admins_list"))
    admin = Admin.query.get_or_404(admin_id)
    db.session.delete(admin)
    db.session.commit()
    flash("Admin deleted.", "info")
    return redirect(url_for("custom_admin.admins_list"))


# ---------- Init function (replaces setup_admin) ----------

def init_admin(app):
    """Register custom admin blueprint."""
    app.register_blueprint(admin_bp)
    return admin_bp
