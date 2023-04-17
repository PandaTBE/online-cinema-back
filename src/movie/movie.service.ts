import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
    constructor(private readonly prisma: PrismaService) {}

    private movieIncludeOptions = {
        actors: true,
        genres: true,
        parameters: true,
    };

    async getAllMovies(searchTerm?: string) {
        const options = {};

        if (searchTerm) {
            options['OR'] = [
                {
                    title: {
                        contains: searchTerm,
                    },
                },
            ];
        }

        const movies = await this.prisma.movie.findMany({
            where: options,
            include: this.movieIncludeOptions,
        });

        return movies;
    }

    async getMostPopularMovies() {
        const movies = await this.prisma.movie.findMany({
            where: {
                numberOfViews: {
                    gte: 1,
                },
            },
            include: this.movieIncludeOptions,
        });

        return movies;
    }

    async getMovieBySlug(slug: string) {
        const movie = await this.prisma.movie.findUnique({
            where: { slug },
            include: this.movieIncludeOptions,
        });

        if (!movie) {
            throw new NotFoundException('Фильм не найден');
        }

        return movie;
    }

    async getMoviesByActorId(actorId: number) {
        try {
            const movies = await this.prisma.movie.findMany({
                where: {
                    actors: {
                        some: {
                            id: actorId,
                        },
                    },
                },
                include: this.movieIncludeOptions,
            });
            return movies;
        } catch (error) {
            throw new BadRequestException(
                'При получении фильмов данного актера произошла ошибка',
            );
        }
    }

    async getMoviesByGenreSlug(genreSlug: string) {
        try {
            const movies = this.prisma.movie.findMany({
                where: {
                    genres: {
                        some: {
                            slug: genreSlug,
                        },
                    },
                },
                include: this.movieIncludeOptions,
            });

            return movies;
        } catch (error) {
            throw new BadRequestException(
                'При получении фильмов данного жанра произошла ошибка',
            );
        }
    }

    async updateNumberOfViews(slug: string) {
        try {
            const movie = await this.prisma.movie.update({
                where: {
                    slug,
                },
                data: {
                    numberOfViews: {
                        increment: 1,
                    },
                },
            });
            return movie;
        } catch (error) {
            throw new BadRequestException(
                'При обновлении числа просмотров возникла ошибка',
            );
        }
    }

    /** Admin only */

    async createMovie(dto: CreateMovieDto) {
        const isSameMovie = await this.prisma.movie.findUnique({
            where: { slug: dto.slug },
        });

        if (isSameMovie) {
            throw new BadRequestException('Фильм с таким slug уже есть');
        }

        const movie = await this.prisma.movie.create({
            data: {
                ...dto,
                genres: {
                    connect: dto.genres.map((id) => ({
                        id,
                    })),
                },
                actors: {
                    connect: dto.actors.map((id) => ({ id })),
                },
                parameters: {
                    create: dto.parameters,
                },
            },
            include: this.movieIncludeOptions,
        });
        return movie;
    }

    async getMovieById(id: number) {
        const movie = await this.prisma.movie.findUnique({
            where: { id },
            include: this.movieIncludeOptions,
        });

        if (!movie) {
            throw new NotFoundException('Фильм не найден');
        }
        return movie;
    }

    async updateMovieById(id: number, dto: UpdateMovieDto) {
        try {
            const movie = await this.prisma.movie.update({
                where: { id },
                data: {
                    ...dto,
                    actors: {
                        set: dto.actors?.map((id) => ({
                            id,
                        })),
                    },
                    genres: {
                        set: dto.genres?.map((id) => ({
                            id,
                        })),
                    },
                    parameters: {
                        update: dto.parameters,
                    },
                },
                include: this.movieIncludeOptions,
            });

            return movie;
        } catch (error) {
            throw new BadRequestException(
                'При обновлении фильма возникла ошибка',
            );
        }
    }

    async deleteMovieById(id: number) {
        try {
            const movie = await this.prisma.movie.delete({
                where: {
                    id,
                },
            });
            return movie;
        } catch (error) {
            throw new BadRequestException(
                'При удалении фильма возникла ошибка',
            );
        }
    }
}
