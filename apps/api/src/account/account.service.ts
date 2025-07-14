// apps/api/src/account/account.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { DEFAULT_SALT_ROUNDS } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateAccountDto): Promise<Account> {
    // 1. Check email đã tồn tại
    const normalizedEmail = dto.email.toLowerCase();
    const exists = await this.findByEmail(normalizedEmail);
    if (exists) {
      throw new ConflictException('Email already registered!');
    }

    // 2. Hash password
    let saltRounds = parseInt(
      this.configService.get(
        'HASH_SALT_ROUNDS',
        DEFAULT_SALT_ROUNDS.toString(),
      ),
      10,
    );
    if (isNaN(saltRounds) || saltRounds < 4) {
      saltRounds = DEFAULT_SALT_ROUNDS;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 3. Tạo user mới (gán thêm role, email đã chuẩn hóa, và password đã hash)
    const account = this.repo.create({
      ...dto,
      email: normalizedEmail,
      password: hashedPassword,
      role: dto.role, // admin, mod, user
    });

    return this.repo.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Account | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.repo.findOne({ where: { email } });
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account | null> {
    const result: UpdateResult = await this.repo.update(id, updateAccountDto);
    if (result.affected === 0) {
      return null;
    }
    const updatedAccount = await this.findOne(id);
    if (!updatedAccount) {
      throw new Error('Account was deleted during update operation');
    }
    return updatedAccount;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const result: DeleteResult = await this.repo.delete(id);
    return { deleted: (result.affected ?? 0) > 0 };
  }
}
