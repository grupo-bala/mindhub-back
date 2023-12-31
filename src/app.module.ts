import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { ExpertiseModule } from "./expertise/expertise.module";
import { MaterialModule } from "./material/material.module";
import { EventsModule } from "./events/events.module";
import { PostModule } from "./post/post.module";
import { BadgeModule } from "./badge/badge.module";
import { TestModule } from "./test/test.module";
import { AskModule } from "./ask/ask.module";
import { StaticModule } from "./assets/assets.module";
import { CommentModule } from "./comment/comment.module";
import { ScoreModule } from "./score/score.module";
import { RankingModule } from "./ranking/ranking.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: "postgres",
                url: configService.get("DATABASE_URL"),
                synchronize: true,
                autoLoadEntities: true,
            }),
        }),
        UserModule,
        AuthModule,
        ExpertiseModule,
        PostModule,
        MaterialModule,
        EventsModule,
        BadgeModule,
        AskModule,
        StaticModule,
        TestModule,
        CommentModule,
        ScoreModule,
        RankingModule,
    ],
    controllers: [],
    providers: [],
})

export class AppModule {}
