import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { DEFAULT_SALT_ROUNDS } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';
import { AccountStatus } from 'src/common/enums/account-status.enum';

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

  async findAll(): Promise<Omit<Account, 'password'>[]> {
    const accounts = await this.repo.find({
      where: { status: AccountStatus.ACTIVE },
      select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
    });
    return accounts;
  }

  async findOne(id: number): Promise<Omit<Account, 'password'> | null> {
    const account = await this.repo.findOne({ 
      where: { id },
      select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
    });
    return account;
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.repo.findOne({ where: { email } });
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Omit<Account, 'password'> | null> {
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
    // Soft delete: mark account as DELETED instead of hard delete
    const result: UpdateResult = await this.repo.update(id, { 
      status: AccountStatus.DELETED 
    });
    return { deleted: (result.affected ?? 0) > 0 };
  }

  async ban(id: number): Promise<{ banned: boolean }> {
    const result: UpdateResult = await this.repo.update(id, { 
      status: AccountStatus.BANNED 
    });
    return { banned: (result.affected ?? 0) > 0 };
  }

  async unban(id: number): Promise<{ unbanned: boolean }> {
    const result: UpdateResult = await this.repo.update(id, { 
      status: AccountStatus.ACTIVE 
    });
    return { unbanned: (result.affected ?? 0) > 0 };
  }
}
