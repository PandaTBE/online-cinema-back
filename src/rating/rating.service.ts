import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetRatingDto } from './dto/set-rating.dto';
import { MovieService } from 'src/movie/movie.service';

@Injectable()
export class RatingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly movieService: MovieService,
    ) {}

    async getRatingByMovieAndUser(userId: number, movieId: number) {
        const rating = await this.prisma.rating.findUnique({
            where: {
                userId_movieId: { userId, movieId },
            },
        });

        if (!rating) {
            throw new NotFoundException('Рейтинг не найден');
        }

        return rating;
    }

    async setRating(userId: number, dto: SetRatingDto) {
        try {
            const rating = await this.prisma.rating.upsert({
                where: {
                    userId_movieId: { userId, movieId: dto.movieId },
                },
                create: {
                    userId,
                    movieId: dto.movieId,
                    rating: dto.rating,
                },
                update: {
                    rating: dto.rating,
                },
            });

            const averageMovieRating = await this.getAverageMovieRating(
                dto.movieId,
            );
            if (averageMovieRating) {
                await this.movieService.updateMovieRating(
                    dto.movieId,
                    averageMovieRating,
                );
            }

            return rating;
        } catch (error) {
            throw new BadRequestException(
                'При установки значения рейтинга произошла ошибка',
            );
        }
    }

    async getAverageMovieRating(movieId: number): Promise<null | number> {
        const rating = await this.prisma.rating.aggregate({
            where: {
                movieId,
            },
            _sum: {
                rating: true,
            },
            _count: true,
        });

        if (!rating) return null;

        return rating._sum.rating / rating._count;
    }
}
