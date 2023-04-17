import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Injectable()
export class ActorService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllActors(searchTerm?: string) {
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
            ];
        }
        const actors = await this.prisma.actor.findMany({
            where: options,
            include: {
                movies: true,
            },
        });

        return actors;
    }

    async getActorBySlug(slug: string) {
        const actor = await this.prisma.actor.findUnique({ where: { slug } });

        if (!actor) {
            throw new NotFoundException('Актер не найден');
        }
        return actor;
    }

    /** Admin only */

    async createActor(dto: CreateActorDto) {
        const isSameActor = await this.prisma.actor.findUnique({
            where: { slug: dto.slug },
        });

        if (isSameActor) {
            throw new BadRequestException('Актер с таким slug уже существует');
        }

        const actor = await this.prisma.actor.create({ data: dto });

        return actor;
    }

    async getActorById(id: number) {
        const actor = await this.prisma.actor.findUnique({ where: { id } });

        if (!actor) {
            throw new NotFoundException('Актер не найден');
        }
        return actor;
    }

    async updateActorById(id: number, dto: UpdateActorDto) {
        try {
            const actor = await this.prisma.actor.update({
                where: {
                    id,
                },
                data: dto,
            });

            return actor;
        } catch (error) {
            throw new BadRequestException('При обновлении возникла ошибка');
        }
    }

    async deleteActorById(id: number) {
        try {
            const deletedActor = await this.prisma.actor.delete({
                where: { id },
            });

            return deletedActor;
        } catch (error) {
            throw new BadRequestException('При удалении возникла ошибка');
        }
    }
}
