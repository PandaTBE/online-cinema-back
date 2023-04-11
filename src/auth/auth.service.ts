import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async login(dto: AuthDto) {
        const user: User | null = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        const isPasswordValid = user &&  await verify(
            user.password,
            dto.password,
        );

        if (!user || !isPasswordValid)
            throw new UnauthorizedException('Неправильный логин или пароль');

        return user;
    }

    async register(dto: AuthDto): Promise<User> {
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

        return user;
    }
}
