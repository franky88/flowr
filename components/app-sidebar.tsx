"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconChartPie,
  IconCreditCard,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconSettings2,
} from "@tabler/icons-react";

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
      url: "/transactions",
      icon: IconListDetails,
    },
    {
      title: "Budgets",
      url: "/budgets",
      icon: IconChartPie,
    },
    {
      title: "Cashflow",
      url: "/cashflow",
      icon: IconChartBar,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconFolder,
    },
    {
      title: "Billing",
      url: "/billing",
      icon: IconCreditCard,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings2,
      items: [
        {
          title: "Accounts",
          url: "/settings/accounts",
        },
        {
          title: "Categories",
          url: "/settings/categories",
        },
        {
          title: "Monthly Configuration",
          url: "/settings/monthly-configuration",
        },
        {
          title: "Workspaces",
          url: "/settings/workspaces",
        },
      ],
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
      url: "/settings",
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
  const { plan } = useSubscription();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-transparent active:bg-transparent overflow-visible"
            >
              <a
                href="/dashboard"
                className="flex items-center overflow-visible"
              >
                <span
                  className="font-display italic font-bold overflow-visible"
                  style={{
                    fontSize: "1.75rem",
                    background: "linear-gradient(90deg, #2d7a4f, #5ecf8a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                    paddingRight: "0.2em", // room for italic overhang
                  }}
                >
                  Flowr
                </span>
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
