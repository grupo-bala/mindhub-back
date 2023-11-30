import { Module } from "@nestjs/common";
import { StaticController } from "./assets.controller";
import { JwtService } from "@nestjs/jwt";

@Module({
    controllers: [StaticController],
    providers: [JwtService]
})
export class StaticModule {}