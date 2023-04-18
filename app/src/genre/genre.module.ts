import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovieModule } from 'src/movie/movie.module';

@Module({
    imports: [MovieModule],
    providers: [GenreService, PrismaService],
    controllers: [GenreController],
})
export class GenreModule {}
