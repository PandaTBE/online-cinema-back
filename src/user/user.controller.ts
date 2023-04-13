import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Auth('admin')
    @Get()
    async getUsers() {
        return [];
    }

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
        @User() user: UserModel,
        @Body() dto: UpdateUserDto,
    ): Promise<Omit<UserModel, 'password'>> {
        return this.userService.updateProfile({ user, dto });
    }

    @Auth('admin')
    @Patch('profile/:id')
    async updateProfileById(
        @User() user: UserModel,
        @Param('id') id: string,
        @Body() dto: AdminUpdateUserDto,
    ): Promise<Omit<UserModel, 'password'>> {
        return this.userService.updateProfile({
            userId: Number(id),
            user,
            dto,
        });
    }
}
