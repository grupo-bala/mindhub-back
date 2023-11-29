import { Module } from "@nestjs/common";
import { AskService } from "./ask.service";
import { AskController } from "./ask.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Score } from "src/score/entities/score.entity";
import { Ask } from "./entities/ask.entity";
import { ScoreModule } from "src/score/score.module";
import { JwtService } from "@nestjs/jwt";
import { ScoreService } from "src/score/score.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ask, Score]),
        ScoreModule,
    ],
    controllers: [AskController],
    providers: [JwtService, ScoreService,AskService],
})
export class AskModule {}
