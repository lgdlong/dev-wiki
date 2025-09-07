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
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AccountRole } from '../../shared/enums/account-role.enum';
import { Roles } from '../../core/decorators/roles.decorator';
import { SetStatusDto } from './dto/set-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

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


  @Patch(':id/status')
  @Roles(AccountRole.ADMIN, AccountRole.MOD)
  async setStatus(
    @Param('id') id: string,
    @Body() dto: SetStatusDto,
  ): Promise<Omit<Account, 'password'>> {
    const account = await this.accountService.setStatus(+id, dto);
    // ẩn password khỏi response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...publicAccount } = account;
    return publicAccount;
  }
}
