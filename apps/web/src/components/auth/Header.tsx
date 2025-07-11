import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="w-full bg-zinc-950 ">
      <div className="mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/vercel.svg" // Hoặc link image online nếu chưa có file public/vercel.svg
            alt="Vercel Logo"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span className="font-semibold text-zinc-50 text-lg tracking-tight">
            Vercel
          </span>
        </Link>
        {/* Sign up button */}
        <Button
          asChild
          variant="outline"
          className="bg-zinc-900 text-zinc-50 border-zinc-800 hover:bg-zinc-800"
        >
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    </header>
  );
}
