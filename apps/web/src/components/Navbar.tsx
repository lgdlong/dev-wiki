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
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <NavigationMenuTrigger>Tutorials</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          DevWiki
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          A comprehensive development wiki for developers.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Introduction">
                    Get started with DevWiki and learn the basics.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem
                    href="/docs/primitives/typography"
                    title="Typography"
                  >
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Videos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {videoComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
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
              className="flex items-center justify-center rounded-full px-5 py-3 text-base h-9 min-w-[100px]"
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
