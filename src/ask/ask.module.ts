import { Module } from "@nestjs/common";
import { AskService } from "./ask.service";
import { AskController } from "./ask.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Score } from "src/score/entities/score.entity";
import { Ask } from "./entities/ask.entity";
import { ScoreModule } from "src/score/score.module";
import { JwtService } from "@nestjs/jwt";
import { ScoreService } from "src/score/score.service";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { CommentService } from "src/comment/comment.service";
import { Post } from "src/post/entities/post.entity";
import { Badge } from "src/badge/entities/badge.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Ask, Score, User, Comment, Post, Badge]),
        ScoreModule,
    ],
    controllers: [AskController],
    providers: [JwtService, AuthService, UserService, ScoreService, AskService, CommentService],
})
export class AskModule {}
