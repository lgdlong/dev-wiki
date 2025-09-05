"use client";

import * as React from "react";
import {
  ChartNoAxesGantt,
  Command,
  LifeBuoy,
  Send,
  Youtube,
  BookText,
  LayoutGrid,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Banknote,
  Workflow,


} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
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

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
        title: "User Management",
        url: "#",
        icon: Users,
        isActive: true,
        items: [
          { title: "Accounts", url: "/admin/users" },
          { title: "Invitations", url: "/admin/users/invitations" },
          { title: "Audit Logs", url: "/admin/users/audit-logs" },
        ],
      },
      {
        title: "Access Control",
        url: "#",
        icon: ShieldCheck,
        items: [
          { title: "Roles", url: "/admin/roles" },
          { title: "Permissions", url: "/admin/permissions" },
          { title: "Policies", url: "/admin/policies" },
        ],
      },
    //   {
    //     title: "Billing",
    //     url: "#",
    //     icon: Banknote,
    //     items: [
    //       { title: "Plans", url: "/admin/billing/plans" },
    //       { title: "Invoices", url: "/admin/billing/invoices" },
    //       { title: "Subscriptions", url: "/admin/billing/subscriptions" },
    //     ],
    //   },
      {
        title: "System",
        url: "#",
        icon: Workflow,
        items: [
          { title: "Queues / Jobs", url: "/admin/system/queues" },
          { title: "Health Checks", url: "/admin/system/health" },
          { title: "Integrations", url: "/admin/system/integrations" },
        ],
      },
      

    
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    // {
    //   name: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">LGD</span>
                  <span className="truncate text-xs">Group</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
