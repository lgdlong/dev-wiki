import { useQuery } from "@tanstack/react-query";
import { meApi } from "@/utils/api/auth";
import type { Account } from "@/types/account";

export function useCurrentUser() {
  return useQuery<Account | undefined>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await meApi();
      return res.user;
    },
    retry: false,
  });
}
