"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconChartPie,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UpgradeButton } from "./UpgeadeButton";
import { useSubscription } from "@/hooks/useSubscription";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconListDetails,
    },
    {
      title: "Budgets",
      url: "/dashboard/budgets",
      icon: IconChartPie,
    },
    {
      title: "Cashflow",
      url: "/dashboard/cashflow",
      icon: IconChartBar,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: IconFolder,
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: IconCreditCard,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  //   documents: [
  //     {
  //       name: "Data Library",
  //       url: "#",
  //       icon: IconDatabase,
  //     },
  //     {
  //       name: "Reports",
  //       url: "#",
  //       icon: IconReport,
  //     },
  //     {
  //       name: "Word Assistant",
  //       url: "#",
  //       icon: IconFileWord,
  //     },
  //   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { plan } = useSubscription()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard" className="flex items-center gap-2">
                <em className="text-4xl font-bold text-primary light:text-secondary font-display italic tracking-tight">
                  Flowr.
                </em>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 pb-2">
          {plan === "free" ? (
            <UpgradeButton className="w-full" />
          ) : (
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-primary/10 text-xs text-primary font-medium">
              ✦ Pro plan
            </div>
          )}
        </div>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
