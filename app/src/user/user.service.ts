import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { USER_FIELDS } from './constants/user.constants';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'argon2';
import { isUndefined } from 'lodash';
import { IUpdateProfileArgs, UserWithFavorites } from './user.interface';
import { User } from '@prisma/client';

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

    async toggleFavorite(movieId: number, user: UserWithFavorites) {
        const favoriteIds = user.favorites.map((favorite) => favorite.id);
        try {
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    favorites: {
                        set: favoriteIds.includes(movieId)
                            ? favoriteIds
                                  .filter((id) => id !== movieId)
                                  .map((id) => ({ id }))
                            : [...favoriteIds, movieId].map((id) => ({ id })),
                    },
                },
                select: USER_FIELDS,
            });
            return updatedUser;
        } catch (error) {
            throw new BadRequestException(
                'Ошибка при обновлении избранных фильмов пользователя',
            );
        }
    }

    async getFavorites(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { favorites: true },
        });
        return user.favorites;
    }

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

    /** Admin only */

    async getUsers() {
        const users = await this.prisma.user.findMany({
            include: { favorites: true },
        });
        return users;
    }

    async deleteUser(userId: number) {
        try {
            const deletedUser = await this.prisma.user.delete({
                where: {
                    id: userId,
                },
            });
            return deletedUser;
        } catch (error) {
            throw new BadRequestException('При удалении возникла ошибка');
        }
    }

    private isAdminUpdateDto(
        dto: AdminUpdateUserDto | UpdateUserDto,
    ): dto is AdminUpdateUserDto {
        return !isUndefined(dto['isAdmin']) || !isUndefined(dto['roles']);
    }
}
