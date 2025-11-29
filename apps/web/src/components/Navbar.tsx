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
      <div className="max-w-7xl mx-auto px-4 flex h-14 items-center">
        {/* Logo on the left */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image
            src="/vercel.svg"
            alt="DevWiki Logo"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="hidden font-bold sm:inline-block">DevWiki</span>
        </Link>
        {/* Search bar */}
        <div className="relative flex-1 max-w-xs mr-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search ( ctrl + k )"
            className="pl-9 pr-4 h-10 rounded-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        {/* Navigation Menu in the center */}
        <NavigationMenu className="flex-1 justify-center" viewport={false}>
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
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4">
                  <ListItem href="/tutorials" title="Tutorials">
                    Step-by-step tutorials and guides.
                  </ListItem>
                  <ListItem href="/examples" title="Examples">
                    Code examples and demos.
                  </ListItem>
                  <ListItem href="/blog" title="Blog">
                    Read our latest blog posts.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sign In/Sign Up Buttons or Account Email Display */}
        {account && account.data?.email ? (
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-primary text-right">
              {account.data.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="ml-auto flex items-center space-x-4">
            <Button
              className="flex items-center justify-center rounded-full px-5 py-2 text-base h-9 min-w-[100px] font-semibold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition"
              size="sm"
              asChild
            >
              <Link href="/login">
                <LogIn className="h-5 w-5 mr-2" />
                Sign in
              </Link>
            </Button>
          </div>
        )}
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
