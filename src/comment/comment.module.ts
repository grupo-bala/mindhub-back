import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ScoreModule } from "src/score/score.module";
import { ScoreService } from "src/score/score.service";
import { Score } from "src/score/entities/score.entity";
import { Comment } from "./entities/comment.entity";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { Post } from "src/post/entities/post.entity";
import { Badge } from "src/badge/entities/badge.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Score, User, Post, Badge]),
        ScoreModule,
    ],
    controllers: [CommentController],
    providers: [JwtService, AuthService, UserService, ScoreService, CommentService],
})

export class CommentModule {}
