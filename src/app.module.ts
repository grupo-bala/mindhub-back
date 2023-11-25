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
import { DataSource } from "typeorm";
import { Badge } from "./badge/entities/badge.entity";
import { User } from "./user/entities/user.entity";
import { Expertise } from "./expertise/entities/expertise.entity";

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
        BadgeModule
    ],
    controllers: [],
    providers: [],
})

export class AppModule {
    constructor(
        private dataSource: DataSource,
        private config: ConfigService,
    ) {
        if (!this.config.get("IS_TEST_ENV")) {
            return;
        }

        this.saveDefaultEntities();
    }

    private async saveDefaultEntities() {
        const badges = this.dataSource.getRepository(Badge);
        const users = this.dataSource.getRepository(User);
        const expertises = this.dataSource.getRepository(Expertise);

        const expertise = new Expertise();
        expertise.title = "Matemática";
        
        const badge = new Badge();
        badge.title = "Aprendiz";

        const user = new User();
        user.name = "teste";
        user.email = "teste";
        user.username = "teste";
        user.hashPassword = "$2b$10$Jnw26Q9ceCviEcMchzAqJu1hg1APTbjZQ4Me821ZMa5OV01e7kNQ6",
        user.xp = 0;
        user.badges = [badge];
        user.currentBadge = badge;
        user.expertises = [expertise];
        user.post = [];

        await badges.save(badge);
        await expertises.save(expertise);
        await users.save(user);
    }
}
