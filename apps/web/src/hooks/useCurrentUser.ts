import { useQuery } from "@tanstack/react-query";
import { meApi } from "@/utils/api/auth";
import type { Account } from "@/types/account";

export function useCurrentUser() {
  return useQuery<Account>({
    queryKey: ["me"],
    queryFn: meApi,
    retry: false,
  });
}
