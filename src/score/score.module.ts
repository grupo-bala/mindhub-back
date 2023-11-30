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

@Module({
    imports: [
        TypeOrmModule.forFeature([Score, User, Comment, Post]),
    ],
    controllers: [ScoreController],
    providers: [JwtService, AuthService, ScoreService, UserService, CommentService],
})
export class ScoreModule {}