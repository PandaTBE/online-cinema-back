import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from '@prisma/client';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { MovieService } from 'src/movie/movie.service';
import { ICollection } from './genre.interface';

@Injectable()
export class GenreService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly movieService: MovieService,
    ) {}

    async getAllGenres(searchTerm?: string) {
        const options = {};

        if (searchTerm) {
            options['OR'] = [
                {
                    name: {
                        contains: searchTerm,
                    },
                },
                {
                    slug: {
                        contains: searchTerm,
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                    },
                },
            ];
        }

        const genres = await this.prisma.genre.findMany({
            where: options,
        });
        return genres;
    }

    async getGenreBySlug(slug: string) {
        const genre = await this.prisma.genre.findUnique({
            where: {
                slug,
            },
        });

        if (!genre) {
            throw new NotFoundException('Жанр не найден');
        }

        return genre;
    }

    async getGenreCollections() {
        const genres = await this.prisma.genre.findMany();

        const collections: ICollection[] = await Promise.all(
            genres.map(async (genre) => {
                const movies = await this.movieService.getMoviesByGenreSlug(
                    genre.slug,
                );
                return {
                    id: genre.id,
                    slug: genre.slug,
                    title: genre.name,
                    image: movies[0]?.bigPoster,
                };
            }),
        );

        return collections;
    }

    /** Admin only */

    async createGenre(dto: CreateGenreDto): Promise<Genre> {
        const isSameGenre = await this.prisma.genre.findUnique({
            where: {
                slug: dto.slug,
            },
        });

        if (isSameGenre) {
            throw new BadRequestException('Жанр с таким slug уже существует');
        }

        const genre = await this.prisma.genre.create({
            data: dto,
        });

        return genre;
    }

    async getGenreById(id: number) {
        const genre = await this.prisma.genre.findUnique({
            where: {
                id,
            },
        });

        if (!genre) {
            throw new NotFoundException('Жанр не найден');
        }

        return genre;
    }

    async updateGenreById(id: number, dto: UpdateGenreDto) {
        try {
            const genre = await this.prisma.genre.update({
                where: { id },
                data: dto,
            });

            return genre;
        } catch (error) {
            throw new BadRequestException('При обновлении возникла ошибка');
        }
    }

    async deleteGenreById(id: number) {
        try {
            const deletedGenre = await this.prisma.genre.delete({
                where: { id },
            });

            return deletedGenre;
        } catch (error) {
            throw new BadRequestException('При удалении возникла ошибка');
        }
    }
}
