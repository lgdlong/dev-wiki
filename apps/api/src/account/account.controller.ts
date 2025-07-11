import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(
    @Body() dto: CreateAccountDto,
  ): Promise<Omit<Account, 'password'>> {
    // Exclude password from response
    const account = await this.accountService.create(dto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...publicAccount } = account;
    return publicAccount;
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
