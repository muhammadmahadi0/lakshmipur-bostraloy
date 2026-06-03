"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  message: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  className?: string
  children?: React.ReactNode
}

const PHONE_NUMBER = "8801700000000"

export default function WhatsAppButton({
  message,
  variant = "default",
  size = "default",
  className = "",
  children
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {children || "অর্ডার করুন"}
    </Button>
  )
}
