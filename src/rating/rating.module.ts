import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovieModule } from 'src/movie/movie.module';

@Module({
    imports: [MovieModule],
    controllers: [RatingController],
    providers: [RatingService, PrismaService],
})
export class RatingModule {}
