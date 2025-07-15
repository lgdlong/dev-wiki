"use client";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./globals.css";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

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
  const hideNavbarRoutes = ["/login", "/signup"];

  const showNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`dark ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          {showNavbar && <Navbar />}
          {children}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
