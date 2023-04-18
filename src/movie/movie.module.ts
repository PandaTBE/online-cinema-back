import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [MovieController],
    providers: [MovieService, PrismaService],
    exports: [MovieService],
})
export class MovieModule {}
