import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_FIELDS } from './user.constants';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getProfile(userId: number): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: USER_FIELDS,
        });

        if (!user) throw new UnauthorizedException('Пользователь не найден');
        return user;
    }
}
