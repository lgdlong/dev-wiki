import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AccountRole } from 'src/common/enums/account-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @Roles(AccountRole.ADMIN, AccountRole.MOD)
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
  @Roles(AccountRole.ADMIN, AccountRole.MOD)
  findAll(): Promise<Omit<Account, 'password'>[]> {
    return this.accountService.findAll();
  }

  @Get(':id')
  @Roles(AccountRole.ADMIN, AccountRole.MOD)
  findOne(@Param('id') id: string): Promise<Omit<Account, 'password'> | null> {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  @Roles(AccountRole.ADMIN, AccountRole.MOD)
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  @Roles(AccountRole.ADMIN, AccountRole.MOD)
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }

  @Patch(':id/ban')
  @Roles(AccountRole.ADMIN, AccountRole.MOD)
  ban(@Param('id') id: string) {
    return this.accountService.ban(+id);
  }

  @Patch(':id/unban')
  @Roles(AccountRole.ADMIN, AccountRole.MOD)
  unban(@Param('id') id: string) {
    return this.accountService.unban(+id);
  }
}
