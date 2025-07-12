import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from 'src/account/entities/account.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Account => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as Account;
  },
);
