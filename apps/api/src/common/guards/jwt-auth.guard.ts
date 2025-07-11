import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // ===== DEVELOPMENT CODE =====
  handleRequest(err, user, info) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('JWT token expired');
    }
    if (info?.message === 'No auth token') {
      throw new UnauthorizedException('JWT access token required');
    }
    if (err || !user) {
      throw new UnauthorizedException('Invalid JWT token');
    }
    return user;
  }
  //   // ===== PRODUCTION CODE =====
  //   handleRequest(err, user, info, context: ExecutionContext) {
  //     if (err || !user) {
  //       // Có thể kiểm tra info để trả message chi tiết hơn nếu muốn
  //       throw new UnauthorizedException('JWT access token required');
  //     }
  //     return user;
  //   }
}
