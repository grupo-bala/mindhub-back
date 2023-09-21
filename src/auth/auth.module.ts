import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get("JWT_SECRET"),
                signOptions: { expiresIn: "60m" }
            }),
        }),
        TypeOrmModule.forFeature([User]),
    ],
    exports: [JwtService],
    controllers: [AuthController],
    providers: [JwtService, AuthService, UserService]
})
export class AuthModule { }
