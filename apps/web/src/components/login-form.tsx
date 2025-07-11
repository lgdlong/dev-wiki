import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-zinc-950 border-0">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Log in to Dev Wiki
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-3">
              <div className="grid gap-3">
                <Input
                  id="email"
                  className="py-5"
                  type="email"
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Input
                  id="password"
                  className="py-5"
                  type="password"
                  placeholder="Password"
                  required
                />
                <div className="flex items-center">
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full py-5">
                  Login
                </Button>
                <Button variant="outline" className="w-full py-5">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
