import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { RankingController } from "./ranking.controller";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";
import { RankingService } from "./ranking.service";
import { UserService } from "src/user/user.service";
import { Badge } from "src/badge/entities/badge.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Badge]),
    ],
    controllers: [RankingController],
    providers: [JwtService, AuthService, RankingService, UserService]
})

export class RankingModule {}