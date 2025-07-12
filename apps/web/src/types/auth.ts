// src/types/auth.ts
export interface LoginResponse {
  access_token: string;
  account: {
    id: number;
    email: string;
    role: string;
    name: string;
    avatar_url?: string; // nếu có
  };
}
export interface SignupResponse {
  account: {
    userId: number;
    email: string;
    role: string;
    // ... các trường khác tuỳ backend trả về
  };
}
