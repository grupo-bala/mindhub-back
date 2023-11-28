import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { JwtService } from "@nestjs/jwt";
import { ScoreService } from "src/score/score.service";
import { ScoreModule } from "src/score/score.module";
import { Score } from "src/score/entities/score.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Score]),
        ScoreModule,
    ],
    controllers: [EventsController],
    providers: [JwtService, ScoreService, EventsService],
})
export class EventsModule {}
