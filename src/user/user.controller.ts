import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { UserWithFavorites } from './user.interface';
import { User as UserModel } from '@prisma/client';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Auth()
    @Get('profile')
    async getProfile(
        @User('id') userId: number,
    ): Promise<Omit<UserModel, 'password'>> {
        return this.userService.getProfile(userId);
    }

    @Auth()
    @Patch('profile')
    async updateProfile(
        @User() user: UserWithFavorites,
        @Body() dto: UpdateUserDto,
    ): Promise<Omit<UserModel, 'password'>> {
        return this.userService.updateProfile({ user, dto });
    }

    @UsePipes(new ValidationPipe())
    @Auth()
    @Patch('profile/favorites')
    async toggleFavorite(
        @Body() { movieId }: ToggleFavoriteDto,
        @User() user: UserWithFavorites,
    ) {
        return this.userService.toggleFavorite(movieId, user);
    }

    @Auth()
    @Get('profile/favorites')
    async getFavorites(@User('id') userId: number) {
        return this.userService.getFavorites(userId);
    }

    /** Admin only */

    @Auth('admin')
    @Get()
    async getUsers() {
        return this.userService.getUsers();
    }

    @Auth('admin')
    @Patch('profile/:id')
    async updateProfileById(
        @User() user: UserWithFavorites,
        @Param('id') id: string,
        @Body() dto: AdminUpdateUserDto,
    ): Promise<Omit<UserModel, 'password'>> {
        return this.userService.updateProfile({
            userId: Number(id),
            user,
            dto,
        });
    }

    @Auth('admin')
    @Delete(':userId')
    async deleteUser(@Param('userId') userId: string) {
        return this.userService.deleteUser(Number(userId));
    }
}
