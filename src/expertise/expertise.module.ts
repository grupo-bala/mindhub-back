import { Module } from "@nestjs/common";
import { ExpertiseService } from "./expertise.service";
import { ExpertiseController } from "./expertise.controller";
import { Expertise } from "./entities/expertise.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Expertise])],
    controllers: [ExpertiseController],
    providers: [ExpertiseService],
})
export class ExpertiseModule {}
