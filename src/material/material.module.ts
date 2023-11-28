import { Module } from "@nestjs/common";
import { MaterialService } from "./material.service";
import { MaterialController } from "./material.controller";
import { Material } from "./entities/material.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ScoreModule } from "src/score/score.module";
import { ScoreService } from "src/score/score.service";
import { Score } from "src/score/entities/score.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Material, Score]),
        ScoreModule,
    ],
    controllers: [MaterialController],
    providers: [JwtService, ScoreService, MaterialService],
})
export class MaterialModule {}
