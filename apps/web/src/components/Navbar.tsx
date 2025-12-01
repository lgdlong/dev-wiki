"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Account } from "@/types/account";
import { UseQueryResult } from "@tanstack/react-query";
import { logoutApi } from "@/utils/api/auth";

const videoComponents: { title: string; href: string; description: string }[] =
  [
    {
      title: "Getting Started",
      href: "/videos/getting-started",
      description:
        "Learn the basics of development with our introductory videos series.",
    },
    {
      title: "Advanced Tutorials",
      href: "/videos/advanced",
      description:
        "Deep dive into advanced development concepts and techniques.",
    },
    {
      title: "Best Practices",
      href: "/videos/best-practices",
      description:
        "Industry best practices and coding standards for developers.",
    },
  ];

export function Navbar() {
  const account = useCurrentUser();

  // Hàm xử lý logout
  async function handleLogout() {
    try {
      // 1. Gọi API để backend clear cookie
      await logoutApi();
    } catch (err) {
      // Optionally handle the error, you can show a toast here
    }
    // 2. Remove access_token from localStorage (if present)
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
    // 3. Reload the page to update the UI
    window.location.reload();
  }

  return (
    <header className="w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 flex h-14 items-center justify-between">
        {/* Logo (left) */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/vercel.svg"
              alt="DevWiki Logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="hidden font-bold sm:inline-block">DevWiki</span>
          </Link>
        </div>

        {/* Nav items (center) */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu className="" viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/tutorials" className="px-4 py-2 font-medium">
                    Tutorials
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/videos" className="px-4 py-2 font-medium">
                    Videos
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth buttons (right) */}
        <div className="flex items-center">
          {account && account.data?.email ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-primary text-right">
                {account.data.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="lg"
                className="px-6 py-2 text-base font-medium"
                asChild
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                variant="default"
                size="lg"
                className="rounded-md px-6 py-2 text-base font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/90 transition"
                asChild
              >
                <Link href="/signup">Đăng ký</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
