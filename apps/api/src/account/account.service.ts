import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
  ) {}

  create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.repo.create(createAccountDto);
    return this.repo.save(account);
  }

  findAll(): Promise<Account[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Account | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<Account | null> {
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
