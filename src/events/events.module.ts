import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([Event])
    ],
    controllers: [EventsController],
    providers: [JwtService, EventsService],
})
export class EventsModule {}
