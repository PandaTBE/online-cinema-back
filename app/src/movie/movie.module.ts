import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TelegramModule, ConfigModule],
    controllers: [MovieController],
    providers: [MovieService, PrismaService],
    exports: [MovieService],
})
export class MovieModule {}
