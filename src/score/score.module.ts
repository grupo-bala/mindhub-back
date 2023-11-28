import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Score } from "./entities/score.entity";
import { ScoreService } from "./score.service";
import { ScoreController } from "./score.controller";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([Score])],
    controllers: [ScoreController],
    providers: [JwtService, ScoreService],
})
export class ScoreModule {}