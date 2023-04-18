import { User } from '@prisma/client';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

export type TUserFields = keyof UserWithFavorites;

export interface IUpdateProfileArgs {
    /**
     * Данные пользователя, который делает запрос на обновление
     */
    user: User;
    /**
     * Тело запроса для обновления
     */
    dto: UpdateUserDto | AdminUpdateUserDto;
    /**
     * Если был передан этот параметр, то происходит обновление пользователя с этим id.
     * Используется в ручке обновления для Админа
     */
    userId?: number;
}

// 1: Define a type that includes the relation to `Post`
const userWithFavorites = Prisma.validator<Prisma.UserArgs>()({
    include: { favorites: true },
});

// 3: This type will include a user and all their posts
export type UserWithFavorites = Prisma.UserGetPayload<typeof userWithFavorites>;
