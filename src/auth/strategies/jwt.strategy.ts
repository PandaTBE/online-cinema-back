import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate({ userId }: { userId: number }): Promise<User> {
        const user = await this.authService.validateUser(userId);

        if (!user) throw new UnauthorizedException('Ошибка аутентификации');

        return user;
    }
}
