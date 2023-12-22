import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { JwtService } from "@nestjs/jwt";
import { ScoreService } from "src/score/score.service";
import { ScoreModule } from "src/score/score.module";
import { Score } from "src/score/entities/score.entity";
import { UserService } from "src/user/user.service";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/user/entities/user.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { CommentService } from "src/comment/comment.service";
import { Post } from "src/post/entities/post.entity";
import { Badge } from "src/badge/entities/badge.entity";
import { Ask } from "src/ask/entities/ask.entity";
import { AskService } from "src/ask/ask.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Score, User, Comment, Post, Badge, Ask]),
        ScoreModule,
    ],
    controllers: [EventsController],
    providers: [JwtService, AuthService, UserService, ScoreService, EventsService, CommentService, AskService],
})
export class EventsModule {}
