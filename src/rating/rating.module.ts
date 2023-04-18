import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovieService } from 'src/movie/movie.service';

@Module({
    controllers: [RatingController],
    providers: [RatingService, PrismaService, MovieService],
})
export class RatingModule {}
