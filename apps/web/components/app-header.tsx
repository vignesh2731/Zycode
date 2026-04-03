"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/contest/create": "Create Contest",
  "/contest/join": "Join Contest",
}

function getPageTitle(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname]
  if (pathname.startsWith("/contest/waiting-room/")) return "Waiting Room"
  if (pathname.startsWith("/contest/winner/")) return "Winner"
  if (pathname.match(/^\/contest\/[^/]+\/\d+$/)) return "Problem"
  return "ZyCode"
}

export function AppHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/40 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-3" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
