"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Encontros",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agentes",
    href: "/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

export function DashboardSidebar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-start justify-center text-sidebar-accent-foreground h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="meetAI"
            height={32}
            width={32}
            className="object-contain"
          />
          <span className="ml-2 text-lg font-semibold tracking-tight">
            meetAI
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    className={cn(
                      "h-10 border border-transparent hover:border-[#5D6B68]/10",
                      pathname === item.href && "border-[#5D6B68]/10"
                    )}
                    onClick={() => isMobile && toggleSidebar()}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 border border-transparent hover:border-[#5D6B68]/10",
                      pathname === item.href && "border-[#5D6B68]/10"
                    )}
                    isActive={pathname === item.href}
                    onClick={() => isMobile && toggleSidebar()}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
