"use client";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./globals.css";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Dùng useState để tránh share queryClient giữa các request
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  // Liệt kê danh sách các route cần ẩn navbar
  const hideNavbar =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/mod") ||
    pathname.startsWith("/admin");

  const showNavbar = !hideNavbar;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <Toaster richColors /> {/* 👈 THÊM DÒNG NÀY */}
          {showNavbar && <Navbar />}
          {children}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
