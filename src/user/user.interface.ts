import { User } from '@prisma/client';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';

export type TUserFields = keyof User;

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
