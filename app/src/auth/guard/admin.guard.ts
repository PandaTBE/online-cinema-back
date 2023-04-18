import {
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';

export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<{ user: User }>();
        const user = request.user;

        if (!user.isAdmin)
            throw new UnauthorizedException('Отказано в доступе');
        return user.isAdmin;
    }
}
