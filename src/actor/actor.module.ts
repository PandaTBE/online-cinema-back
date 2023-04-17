import { Module } from '@nestjs/common';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [ActorController],
    providers: [ActorService, PrismaService],
})
export class ActorModule {}
