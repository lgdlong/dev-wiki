"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-zinc-950 border-0">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-3">
              {/* Name */}
              <div className="grid gap-3">
                <Input
                  id="name"
                  className="py-5"
                  type="text"
                  placeholder="Full Name"
                  required
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Input
                  id="email"
                  className="py-5"
                  type="email"
                  placeholder="Email Address"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <div className="relative">
                  <Input
                    id="password"
                    className="py-5 pr-12"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center p-1 text-zinc-400 hover:text-zinc-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="grid gap-3">
                <div className="relative">
                  <Input
                    id="confirm-password"
                    className="py-5 pr-12"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center p-1 text-zinc-400 hover:text-zinc-200"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Button type="submit" className="w-full py-5">
                  Sign up
                </Button>
                <Button variant="outline" className="w-full py-5">
                  Sign up with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
