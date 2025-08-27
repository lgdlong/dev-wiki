import { AuthAccountResponse } from './interfaces/auth-account-response.interface';

export function buildGoogleRedirectUrl(
  frontendUrl: string,
  account: AuthAccountResponse,
) {
  const params = new URLSearchParams({
    provider: 'google',
    name: account.name ?? '',
    email: account.email,
    role: account.role,
  });

  return `${frontendUrl}/google-callback?${params.toString()}`;
}
