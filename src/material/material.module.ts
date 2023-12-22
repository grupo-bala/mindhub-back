import { Module } from "@nestjs/common";
import { MaterialService } from "./material.service";
import { MaterialController } from "./material.controller";
import { Material } from "./entities/material.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ScoreModule } from "src/score/score.module";
import { ScoreService } from "src/score/score.service";
import { Score } from "src/score/entities/score.entity";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { AuthService } from "src/auth/auth.service";
import { Comment } from "src/comment/entities/comment.entity";
import { CommentService } from "src/comment/comment.service";
import { Post } from "src/post/entities/post.entity";
import { Badge } from "src/badge/entities/badge.entity";
import { Ask } from "src/ask/entities/ask.entity";
import { AskService } from "src/ask/ask.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Material, Score, User, Comment, Post, Badge, Ask]),
        ScoreModule,
    ],
    controllers: [MaterialController],
    providers: [JwtService, AuthService, UserService, ScoreService, MaterialService, CommentService, AskService],
})
export class MaterialModule {}
