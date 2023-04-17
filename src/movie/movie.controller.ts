import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { UpdateNumberOfViewsDto } from './dto/update-number-of-views.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    async getAllMovies(@Query('search-term') searchTerm?: string) {
        return this.movieService.getAllMovies(searchTerm);
    }

    @Get('most-popular')
    async getMostPopularMovies() {
        return this.movieService.getMostPopularMovies();
    }

    @Get('by-slug/:slug')
    async getMovieBySlug(@Param('slug') slug: string) {
        return this.movieService.getMovieBySlug(slug);
    }

    @Get('by-actor/:actorId')
    async getMoviesByActorId(@Param('actorId') actorId: string) {
        return this.movieService.getMoviesByActorId(Number(actorId));
    }

    @Get('by-genre/:genreSlug')
    async getMoviesByGenreSlug(@Param('genreSlug') genreSlug: string) {
        return this.movieService.getMoviesByGenreSlug(genreSlug);
    }

    @UsePipes(new ValidationPipe())
    @Patch('update-number-of-views')
    async updateNumberOfViews(@Body() { slug }: UpdateNumberOfViewsDto) {
        return this.movieService.updateNumberOfViews(slug);
    }

    /** Admin only */

    @Auth('admin')
    @UsePipes(new ValidationPipe())
    @Post()
    async createMovie(@Body() dto: CreateMovieDto) {
        return this.movieService.createMovie(dto);
    }

    @Auth('admin')
    @Get(':id')
    async getMovieById(@Param('id') id: string) {
        return this.movieService.getMovieById(Number(id));
    }

    @Auth('admin')
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async updateMovieById(
        @Param('id') id: string,
        @Body() dto: UpdateMovieDto,
    ) {
        return this.movieService.updateMovieById(Number(id), dto);
    }

    @Auth('admin')
    @Delete(':id')
    async deleteMovieById(@Param('id') id: string) {
        return this.movieService.deleteMovieById(Number(id));
    }
}
