import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: AuthDto) {
        const user: User | null = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        const isPasswordValid =
            user && (await verify(user.password, dto.password));

        if (!user || !isPasswordValid)
            throw new UnauthorizedException('Неправильный логин или пароль');

        return this.generateTokens({ userId: user.id });
    }

    async register(
        dto: AuthDto,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const isUserExist = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (isUserExist) {
            throw new BadRequestException(
                'Пользователь с таким email уже зарегистрирован',
            );
        }

        const user = await this.prisma.user.create({
            data: {
                ...dto,
                password: await hash(dto.password),
            },
        });

        return this.generateTokens({ userId: user.id });
    }

    async generateTokens(payload: { userId: number }) {
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    async validateUser(userId: number): Promise<User> {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }
}