import { AccountRole } from '../../../shared/enums/account-role.enum';

export interface JwtPayload {
  sub: number | string; // userId (nên là số) hoặc googleId nếu chưa tạo user DB
  email: string; // Email người dùng
  role: AccountRole; // Role (enum)
  name: string; // (Optional) Tên user
  avatar?: string; // (Optional) Avatar (nếu cần)
  provider?: string; // (Optional) "google" | "local" | ...
  // Không cần khai báo iat, exp (NestJS/JWT tự động thêm)
}
