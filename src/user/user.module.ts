import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UserController],
    providers: [AuthService, UserService],
})

export class UserModule { }
