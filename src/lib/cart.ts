"use client"

export interface CartItem {
  id: number
  slug: string
  name: string
  nameBn: string
  price: number
  image: string
  quantity: number
}

const CART_KEY = "lakshmipur_cart"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(CART_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(item: Omit<CartItem, "quantity">): CartItem[] {
  const cart = getCart()
  const existing = cart.find(i => i.id === item.id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }
  saveCart(cart)
  return cart
}

export function removeFromCart(id: number): CartItem[] {
  const cart = getCart().filter(i => i.id !== id)
  saveCart(cart)
  return cart
}

export function updateQuantity(id: number, quantity: number): CartItem[] {
  const cart = getCart()
  const item = cart.find(i => i.id === id)
  if (item) {
    item.quantity = Math.max(1, quantity)
  }
  saveCart(cart)
  return cart
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function clearCart(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CART_KEY)
}
