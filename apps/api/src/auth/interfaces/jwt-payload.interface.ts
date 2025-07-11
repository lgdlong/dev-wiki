export interface JwtPayload {
  sub: number; // User ID
  email: string; // User email
  role: string; // Role của user (bắt buộc, nếu chỉ 1 role)
  name?: string; // (Optional) Tên user nếu bạn muốn truyền
  iat?: number; // (Tự động) Thời gian phát hành token (Issued At)
  exp?: number; // (Tự động) Thời gian hết hạn token (Expiration)
}
