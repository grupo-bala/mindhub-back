import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Badge } from "./entities/badge.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Badge])]
})
export class BadgeModule {}