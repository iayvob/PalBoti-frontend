"use client"

import type React from "react"

import { Bell, Menu, Moon, Search, Sun, User } from "lucide-react"
import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import { useTheme } from "../../components/theme-provider"
import Image from "next/image"

interface NavbarProps {
  toggleSidebar: () => void
  style?: React.CSSProperties
}

export default function Navbar({ toggleSidebar, style }: NavbarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 transition-shadow duration-300"
      style={style}
    >
      <Button variant="outline" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="hidden md:flex items-center">
        <Image src="/images/palboti.png" alt="PalBoti Logo" width={30} height={30} className="mr-2" />
        <span className="text-xl font-bold text-primary">PalBoti</span>
      </div>

      <div className="flex-1 md:flex md:justify-center">
        <div className="w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory, robots..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px] border-primary/30 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
