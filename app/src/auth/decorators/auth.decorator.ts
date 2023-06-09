import { UseGuards, applyDecorators } from '@nestjs/common';
import { TRole } from '../auth.interface';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { AdminGuard } from '../guard/admin.guard';
import { RolesGuard } from '../guard/roles.guard';

export const Auth = (role: TRole = 'user') =>
    applyDecorators(
        role === 'admin'
            ? UseGuards(JwtAuthGuard, AdminGuard)
            : UseGuards(JwtAuthGuard, RolesGuard),
    );
