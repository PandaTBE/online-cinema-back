import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { difference } from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        );
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest<{ user: User }>();

        const user = request.user;

        return this.matchRoles(roles, user.roles);
    }

    private matchRoles(roles: string[], userRoles: string[]): boolean {
        return difference(roles, userRoles).length === 0;
    }
}
