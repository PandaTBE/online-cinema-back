import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genres')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Get()
    async getAllGenre() {
        return this.genreService.getAllGenres();
    }

    @Get('by-slug/:slug')
    async getGenreBySlug(@Param('slug') slug: string) {
        return this.genreService.getGenreBySlug(slug);
    }

    @Get('collections')
    async getGenreCollection() {
        return this.genreService.getGenreCollections();
    }

    /** Admin only */

    @UsePipes(new ValidationPipe())
    @Auth('admin')
    @Post()
    async createGenre(@Body() dto: CreateGenreDto) {
        return this.genreService.createGenre(dto);
    }

    @Auth('admin')
    @Get(':id')
    async getGenreById(@Param('id') id: string) {
        return this.genreService.getGenreById(Number(id));
    }

    @Auth('admin')
    @Patch(':id')
    async updateGenreById(
        @Param('id') id: string,
        @Body() dto: UpdateGenreDto,
    ) {
        return this.genreService.updateGenreById(Number(id), dto);
    }

    @Auth('admin')
    @Delete(':id')
    async deleteGenreById(@Param('id') id: string) {
        return this.genreService.deleteGenreById(Number(id));
    }
}
