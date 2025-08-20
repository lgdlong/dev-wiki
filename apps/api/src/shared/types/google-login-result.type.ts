import { GoogleProfile } from '../../modules/auth/interfaces/google-profile.interface';

export type GoogleLoginResult =
  | { message: string }
  | { message: string; user: GoogleProfile };
