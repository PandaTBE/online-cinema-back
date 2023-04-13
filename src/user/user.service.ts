import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_FIELDS } from './constants/user.constants';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'argon2';
import { isUndefined } from 'lodash';
import { IUpdateProfileArgs } from './user.interface';

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

    /**
     * Обновление профиля пользователя (не админа)
     */
    async updateProfile(
        args: IUpdateProfileArgs,
    ): Promise<Omit<User, 'password'>> {
        const { user, dto, userId } = args;

        if (this.isAdminUpdateDto(dto) && !user.isAdmin) {
            throw new UnauthorizedException(
                'У Вас нет прав на изменение некоторых полей',
            );
        }

        let isSameUser = false;

        if (dto.email) {
            isSameUser = Boolean(
                await this.prisma.user.findUnique({
                    where: { email: dto.email },
                }),
            );
        }

        if (isSameUser)
            throw new BadRequestException(
                'Пользователь с таким email уже есть',
            );

        if (dto.password) {
            dto.password = await hash(dto.password);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId || user.id },
            select: USER_FIELDS,
            data: dto,
        });

        return updatedUser;
    }

    private isAdminUpdateDto(
        dto: AdminUpdateUserDto | UpdateUserDto,
    ): dto is AdminUpdateUserDto {
        return !isUndefined(dto['isAdmin']) || !isUndefined(dto['roles']);
    }
}
