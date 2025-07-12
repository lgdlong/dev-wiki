export interface Account {
  userId: number; // ID trong hệ thống của bạn
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'local'; // hoặc thêm các provider khác nếu có
  role?: string;
  googleId?: string; // Có thể null nếu user tạo qua email thường
  emailVerified?: boolean;
}
