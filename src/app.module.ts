import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GenreModule } from './genre/genre.module';

@Module({
    imports: [ConfigModule.forRoot(), PrismaModule, AuthModule, UserModule, GenreModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
