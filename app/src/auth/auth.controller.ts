import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ITokenPair } from './auth.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @Post('login')
    async login(@Body() dto: AuthDto): Promise<ITokenPair> {
        return this.authService.login(dto);
    }

    @UsePipes(new ValidationPipe())
    @Post('refresh-token')
    async refreshToken(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto);
    }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: AuthDto): Promise<ITokenPair> {
        return this.authService.register(dto);
    }
}
