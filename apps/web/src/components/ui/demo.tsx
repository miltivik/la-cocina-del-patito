"use client"
import { Dock } from "@/components/ui/dock-two"
import {
  Home,
  LayoutDashboard,
  MessageSquare,
  Sun,
  Moon,
  User
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"

function NavigationDock() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleProfileClick = () => {
    if (session?.user) {
      router.push("/settings")
    } else {
      router.push("/login")
    }
  }

  const items = [
    { icon: Home, label: "Home", onClick: () => router.push("/") },
    { icon: LayoutDashboard, label: "Dashboard", onClick: () => router.push("/dashboard") },
    { icon: MessageSquare, label: "AI Chat", onClick: () => router.push("/ai") },
    {
      icon: mounted ? (theme === "dark" ? Sun : Moon) : Sun,
      label: "Toggle Theme",
      onClick: toggleTheme
    },
    {
      icon: User,
      label: session?.user ? "Profile" : "Login",
      onClick: handleProfileClick
    }
  ]

  return <Dock items={items} />
}

export { NavigationDock }

import { Footer } from "@/components/ui/large-name-footer";

function FooterDemo() {
  return (
    <div className="block">
      <Footer />
    </div>
  );
}

export { FooterDemo };
