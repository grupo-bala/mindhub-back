import { Module } from "@nestjs/common";
import { StaticController } from "./static.controller";
import { JwtService } from "@nestjs/jwt";

@Module({
    controllers: [StaticController],
    providers: [JwtService]
})
export class StaticModule {}