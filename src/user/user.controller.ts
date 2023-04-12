import { Controller, Get } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';

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
}
