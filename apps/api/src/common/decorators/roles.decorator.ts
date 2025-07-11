// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AccountRole } from '../enums/account-role.enum';
import { ROLES_KEY } from '../constants';

export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles);
