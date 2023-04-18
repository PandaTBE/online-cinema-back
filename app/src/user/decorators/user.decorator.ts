import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TUserFields, UserWithFavorites } from '../user.interface';

export const User = createParamDecorator(
    (data: TUserFields | undefined, ctx: ExecutionContext) => {
        const request = ctx
            .switchToHttp()
            .getRequest<{ user: UserWithFavorites }>();
        const user = request.user;

        return data ? user[data] : user;
    },
);
