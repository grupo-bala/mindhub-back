import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Score } from "./entities/score.entity";
import { ScoreService } from "./score.service";
import { ScoreController } from "./score.controller";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { AuthService } from "src/auth/auth.service";
import { CommentService } from "src/comment/comment.service";
import { Post } from "src/post/entities/post.entity";
import { Badge } from "src/badge/entities/badge.entity";
import { AskService } from "src/ask/ask.service";
import { Ask } from "src/ask/entities/ask.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Score, User, Comment, Post, Badge, Ask]),
    ],
    controllers: [ScoreController],
    providers: [JwtService, AuthService, ScoreService, UserService, CommentService, AskService],
})
export class ScoreModule {}