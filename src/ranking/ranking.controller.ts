import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RankingService } from "./ranking.service";
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags("ranking")
@ApiBearerAuth()
@Controller("ranking")
export class RankingController {
    constructor(
        private readonly rankingService: RankingService,
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    async findAll() {
        return await this.rankingService.findAll();
    }

    @Get("/rank/:username")
    @UseGuards(AuthGuard)
    async getRank(
        @Param("username") username: string,
    ) {
        return await this.rankingService.getRank(username);
    }
}