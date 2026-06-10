"""Database models for Lakshmipur Bostraloy.

Tables: categories, products, product_variants, customers, orders,
order_items, banners, admins, site_settings, reviews, coupons.
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

db = SQLAlchemy()


class Admin(UserMixin, db.Model):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), default="Admin")
    role = db.Column(db.String(20), default="owner")  # owner, manager, staff
    enabled = db.Column("is_active", db.Boolean, default=True)  # mapped to 'is_active' column
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    name_bn = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, default="")
    description_bn = db.Column(db.Text, default="")
    image = db.Column(db.String(500), default="")
    icon = db.Column(db.String(50), default="")  # emoji or icon class
    sort_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    products = db.relationship("Product", backref="category", lazy="dynamic")

    def __repr__(self):
        return f"<Category {self.name_bn}>"


class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(160), unique=True, nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False)
    name_bn = db.Column(db.String(200), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    price = db.Column(db.Float, nullable=False, default=0)
    original_price = db.Column(db.Float, default=0)  # for showing discount
    description = db.Column(db.Text, default="")
    description_bn = db.Column(db.Text, default="")
    images = db.Column(db.Text, default="")  # JSON array of URLs
    in_stock = db.Column(db.Boolean, default=True)
    is_active = db.Column(db.Boolean, default=True)
    stock_count = db.Column(db.Integer, default=0)
    is_featured = db.Column(db.Boolean, default=False)
    is_best_seller = db.Column(db.Boolean, default=False)
    view_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    variants = db.relationship("ProductVariant", backref="product", lazy="dynamic", cascade="all, delete-orphan")
    reviews = db.relationship("Review", backref="product", lazy="dynamic", cascade="all, delete-orphan")

    def get_images(self):
        import json
        try:
            return json.loads(self.images) if self.images else []
        except (json.JSONDecodeError, TypeError):
            return []

    def set_images(self, image_list):
        import json
        self.images = json.dumps(image_list)

    def has_discount(self):
        return self.original_price and self.original_price > self.price

    def discount_percent(self):
        if self.has_discount():
            return int((1 - self.price / self.original_price) * 100)
        return 0

    def average_rating(self):
        reviews = self.reviews.all()
        if not reviews:
            return 0
        return sum(r.rating for r in reviews) / len(reviews)

    def __repr__(self):
        return f"<Product {self.name_bn}>"


class ProductVariant(db.Model):
    __tablename__ = "product_variants"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    size = db.Column(db.String(20), default="")  # e.g. "M", "L", "XL", "38", "40"
    color = db.Column(db.String(50), default="")  # e.g. "Red", "Blue"
    color_bn = db.Column(db.String(50), default="")
    sku = db.Column(db.String(50), default="")
    stock_count = db.Column(db.Integer, default=0)
    price_override = db.Column(db.Float, default=0)  # 0 means use product price
    is_active = db.Column(db.Boolean, default=True)

    def display_price(self):
        return self.price_override if self.price_override > 0 else self.product.price

    @property
    def variant_in_stock(self):
        return self.stock_count > 0

    def __repr__(self):
        return f"<Variant {self.size}/{self.color}>"


class Customer(db.Model):
    __tablename__ = "customers"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False, index=True)
    email = db.Column(db.String(255), default="")
    address = db.Column(db.Text, default="")
    city = db.Column(db.String(80), default="")
    total_orders = db.Column(db.Integer, default=0)
    total_spent = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship("Order", backref="customer", lazy="dynamic")


class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"))
    # Guest customer info (in case not registered)
    customer_name = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    customer_address = db.Column(db.Text, nullable=False)
    note = db.Column(db.Text, default="")
    # Status: pending, confirmed, processing, shipped, delivered, cancelled
    status = db.Column(db.String(20), default="pending")
    payment_method = db.Column(db.String(20), default="cod")  # cod, bkash, nagad, rocket
    payment_status = db.Column(db.String(20), default="unpaid")  # unpaid, paid
    items_json = db.Column(db.Text, default="[]")  # snapshot of items
    subtotal = db.Column(db.Float, default=0)
    shipping = db.Column(db.Float, default=60)
    discount = db.Column(db.Float, default=0)
    total = db.Column(db.Float, default=0)
    status_history = db.Column(db.Text, default="[]")  # JSON array
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def get_items(self):
        import json
        try:
            return json.loads(self.items_json) if self.items_json else []
        except (json.JSONDecodeError, TypeError):
            return []

    def set_items(self, items):
        import json
        self.items_json = json.dumps(items, ensure_ascii=False)

    def get_status_history(self):
        import json
        try:
            return json.loads(self.status_history) if self.status_history else []
        except (json.JSONDecodeError, TypeError):
            return []

    def add_status(self, status, note=""):
        history = self.get_status_history()
        history.append({
            "status": status,
            "note": note,
            "at": datetime.utcnow().isoformat()
        })
        self.status_history = __import__("json").dumps(history, ensure_ascii=False)
        self.status = status


class Banner(db.Model):
    __tablename__ = "banners"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), default="")
    title_bn = db.Column(db.String(200), default="")
    subtitle = db.Column(db.String(300), default="")
    subtitle_bn = db.Column(db.String(300), default="")
    image = db.Column(db.String(500), default="")
    link = db.Column(db.String(300), default="")
    position = db.Column(db.String(30), default="hero")  # hero, sidebar, footer
    sort_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Review(db.Model):
    __tablename__ = "reviews"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    customer_name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text, default="")
    is_approved = db.Column(db.Boolean, default=True)
    is_verified_purchase = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Coupon(db.Model):
    __tablename__ = "coupons"
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(30), unique=True, nullable=False, index=True)
    description = db.Column(db.String(200), default="")
    discount_type = db.Column(db.String(10), default="percent")  # percent, flat
    discount_value = db.Column(db.Float, default=0)
    min_order = db.Column(db.Float, default=0)
    max_uses = db.Column(db.Integer, default=0)  # 0 = unlimited
    used_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def is_valid(self, cart_total):
        if not self.is_active:
            return False, "Invalid coupon"
        if self.expires_at and self.expires_at < datetime.utcnow():
            return False, "Coupon expired"
        if self.max_uses > 0 and self.used_count >= self.max_uses:
            return False, "Coupon usage limit reached"
        if cart_total < self.min_order:
            return False, f"Minimum order ৳{self.min_order:.0f}"
        return True, "OK"

    def calculate_discount(self, cart_total):
        if self.discount_type == "percent":
            return cart_total * (self.discount_value / 100)
        return self.discount_value


class SiteSetting(db.Model):
    __tablename__ = "site_settings"
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    value = db.Column(db.Text, default="")

    @staticmethod
    def get(key, default=""):
        s = SiteSetting.query.filter_by(key=key).first()
        return s.value if s else default

    @staticmethod
    def set(key, value):
        s = SiteSetting.query.filter_by(key=key).first()
        if s:
            s.value = value
        else:
            db.session.add(SiteSetting(key=key, value=value))
        db.session.commit()
