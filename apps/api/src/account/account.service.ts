import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Repository } from 'typeorm';
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

  update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account | null> {
    return this.repo.update(id, updateAccountDto).then(() => {
      return this.findOne(id);
    });
  }

  remove(id: number): Promise<{ deleted: boolean }> {
    return this.repo.delete(id).then(() => {
      return { deleted: true };
    });
  }
}
