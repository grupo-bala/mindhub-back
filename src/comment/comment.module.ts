import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ScoreModule } from "src/score/score.module";
import { ScoreService } from "src/score/score.service";
import { Score } from "src/score/entities/score.entity";
import { Comment } from "./entities/comment.entity";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Score]),
        ScoreModule,
    ],
    controllers: [CommentController],
    providers: [JwtService, ScoreService, CommentService],
})

export class CommentModule {}
