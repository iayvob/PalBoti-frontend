"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { BarChart3, LayoutDashboard, Package, Settings, Users, Layers, Warehouse } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import Image from "next/image"

interface SidebarProps {
  open: boolean
}

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
  collapsed?: boolean
  onClick?: () => void
}

function SidebarItem({ icon: Icon, label, href, active = false, collapsed = false, onClick }: SidebarItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} passHref>
            <Button
              onClick={onClick}
              variant={active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                collapsed ? "px-2" : "px-4",
                active && "bg-primary/10 text-primary hover:bg-primary/20",
              )}
            >
              <Icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2", active && "text-primary")} />
              {!collapsed && <span>{label}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}

export default function Sidebar({ open }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard")

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r bg-background transition-all duration-300 md:z-0",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {open ? (
          <div className="flex items-center">
            <Image src="/images/palboti.png" alt="PalBoti Logo" width={30} height={30} className="mr-2" />
            <span className="text-xl font-bold text-primary">PalBoti</span>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <Image src="/images/palboti.png" alt="PalBoti Logo" width={24} height={24} />
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/dashboard"
            active={activeItem === "dashboard"}
            collapsed={!open}
            onClick={() => setActiveItem("dashboard")}
          />
          <SidebarItem
            icon={Warehouse}
            label="Warehouse"
            href="/dashboard/warehouse"
            active={activeItem === "warehouse"}
            collapsed={!open}
            onClick={() => setActiveItem("warehouse")}
          />
          <SidebarItem
            icon={Layers}
            label="Shelves"
            href="/dashboard/shelves"
            active={activeItem === "shelves"}
            collapsed={!open}
            onClick={() => setActiveItem("shelves")}
          />
          <SidebarItem
            icon={Package}
            label="Products"
            href="/dashboard/products"
            active={activeItem === "products"}
            collapsed={!open}
            onClick={() => setActiveItem("products")}
          />
          <SidebarItem
            icon={BarChart3}
            label="Analytics"
            href="/dashboard/analytics"
            active={activeItem === "analytics"}
            collapsed={!open}
            onClick={() => setActiveItem("analytics")}
          />
          <SidebarItem
            icon={Users}
            label="Others"
            href="/dashboard/others"
            active={activeItem === "others"}
            collapsed={!open}
            onClick={() => setActiveItem("others")}
          />
        </nav>
      </div>
      <div className="border-t p-2">
        <SidebarItem
          icon={Settings}
          label="Settings"
          href="/dashboard/settings"
          active={activeItem === "settings"}
          collapsed={!open}
          onClick={() => setActiveItem("settings")}
        />
      </div>
    </aside>
  )
}