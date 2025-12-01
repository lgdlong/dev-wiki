"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Videos", href: "/videos" },
  { label: "Bài viết", href: "/tutorials" },
];

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold tracking-tight text-gray-950">
            Dev Wiki
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button
            size="sm"
            className="bg-gray-950 text-white hover:bg-gray-800"
            asChild
          >
            <Link href="/signup">Bắt đầu ngay</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 md:hidden"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-gray-950" />
          ) : (
            <Menu className="h-5 w-5 text-gray-950" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-gray-200 bg-white transition-all duration-300 md:hidden",
          isOpen ? "max-h-64" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-950"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button
              size="sm"
              className="bg-gray-950 text-white hover:bg-gray-800"
              asChild
            >
              <Link href="/signup">Bắt đầu ngay</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
