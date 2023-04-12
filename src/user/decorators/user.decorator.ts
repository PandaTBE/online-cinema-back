import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TUserFields } from '../user.interface';
import { User as UserModel } from '@prisma/client';

export const User = createParamDecorator(
    (data: TUserFields | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<{ user: UserModel }>();
        const user = request.user;
        return data ? user[data] : user;
    },
);
