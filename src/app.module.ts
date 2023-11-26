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
                host: configService.get("DB_HOST"),
                port: configService.get("DB_PORT"),
                username: configService.get("DB_USERNAME"),
                password: configService.get("DB_PASSWORD"),
                database: configService.get("DB_NAME"),
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
        TestModule
    ],
    controllers: [],
    providers: [],
})

export class AppModule {}
