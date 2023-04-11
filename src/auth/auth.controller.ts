import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @Post('login')
    async login(@Body() dto: AuthDto) {
        return this.AuthService.login(dto);
    }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: AuthDto): Promise<User> {
        return this.AuthService.register(dto);
    }
}
