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
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateActorDto } from './dto/update-actor.dto';

@Controller('actors')
export class ActorController {
    constructor(private readonly actorService: ActorService) {}

    @Get()
    async getAllActors(@Query('search-term') searchTerm?: string) {
        return this.actorService.getAllActors(searchTerm);
    }

    @Get('by-slug/:slug')
    async getActorBySlug(@Param('slug') slug: string) {
        return this.actorService.getActorBySlug(slug);
    }

    /** Admin only */

    @UsePipes(new ValidationPipe())
    @Auth('admin')
    @Post()
    async createActor(@Body() dto: CreateActorDto) {
        return this.actorService.createActor(dto);
    }

    @Auth('admin')
    @Get(':id')
    async getActorById(@Param('id') id: string) {
        return this.actorService.getActorById(Number(id));
    }

    @Auth('admin')
    @Patch(':id')
    async updateActorById(
        @Param('id') id: string,
        @Body() dto: UpdateActorDto,
    ) {
        return this.actorService.updateActorById(Number(id), dto);
    }

    @Auth('admin')
    @Delete(':id')
    async deleteActorById(@Param('id') id: string) {
        return this.actorService.deleteActorById(Number(id));
    }
}
