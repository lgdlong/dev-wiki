// Example usage of shared enums in the web app
import { AccountRole, AccountStatus } from "@dev-wiki/enums";

export function getUserRoleLabel(role: AccountRole): string {
  switch (role) {
    case AccountRole.ADMIN:
      return "Administrator";
    case AccountRole.MODERATOR:
      return "Moderator";
    case AccountRole.USER:
      return "User";
    default:
      return "Unknown";
  }
}

export function getUserStatusLabel(status: AccountStatus): string {
  switch (status) {
    case AccountStatus.ACTIVE:
      return "Active";
    case AccountStatus.INACTIVE:
      return "Inactive";
    case AccountStatus.BANNED:
      return "Banned";
    default:
      return "Unknown";
  }
}

export function isActiveUser(status: AccountStatus): boolean {
  return status === AccountStatus.ACTIVE;
}
