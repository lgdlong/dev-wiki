import { AccountService } from './../account/account.service';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

const DEFAULT_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // validateUser là tên hàm chuẩn của Passport Local Strategy
  // Hàm này sẽ được gọi khi người dùng đăng nhập
  // Không thay đổi tên hàm này để Passport có thể nhận diện
  async validateUser(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    // 1. Tìm tài khoản theo email
    const account = await this.accountService.findByEmail(username);

    // 2. Kiểm tra tài khoản có tồn tại không và mật khẩu có khớp không
    if (!account) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    // So sánh mật khẩu đã hash bằng bcrypt với mật khẩu người dùng nhập vào
    const isMatch = await bcrypt.compare(pass, account.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    // 3. Tạo JWT token
    // Tạo payload cho JWT, có thể thêm thông tin khác nếu cần
    const payload: JwtPayload = { sub: account.id, email: account.email };

    return {
      // Sử dụng JwtService để tạo token từ payload
      // access_token là tên chuẩn, có thể đổi nếu cần
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(dto: RegisterUserDto) {
    // 1. Check email đã tồn tại
    const normalizedEmail = dto.email.toLowerCase();
    const exists = await this.accountService.findByEmail(normalizedEmail);
    if (exists) {
      throw new ConflictException('Email already registered!');
    }

    // 2. Hash password
    // Lấy số vòng salt từ config, nếu không có thì dùng mặc định
    let saltRounds = parseInt(
      this.configService.get(
        'HASH_SALT_ROUNDS',
        DEFAULT_SALT_ROUNDS.toString(),
      ),
      10,
    );
    // Kiểm tra saltRounds hợp lệ
    if (isNaN(saltRounds) || saltRounds < 4) {
      saltRounds = DEFAULT_SALT_ROUNDS; // hoặc số nào bạn muốn
    }
    // Tạo salt và hash password
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 3. Tạo user mới
    await this.accountService.create({
      ...dto,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 4. Không trả về JWT hoặc user, chỉ trả message
    return {
      message: 'Registration successful! Please login to continue.',
    };
  }
}
