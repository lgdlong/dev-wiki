import { logoutApi } from "@/utils/api/auth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function useLogout() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    try {
      await logoutApi();
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
      startTransition(() => {
        router.replace("/login");
      });
    } catch (err) {
      // Optionally show error toast
      // eslint-disable-next-line no-console
      console.error("Logout failed", err);
    }
  };

  return { handleLogout, isPending };
}
