import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ScoreService } from "./score.service";
import { AuthGuard, Request } from "src/auth/auth.guard";
import { VoteScoreDto } from "./dto/vote-score.dto";

@ApiTags("score")
@ApiBearerAuth()
@Controller("score")
export class ScoreController {
    constructor(
        private readonly scoreService: ScoreService,
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async vote(
        @Body() voteScoreDto: VoteScoreDto,
        @Req() req: Request,
    ) {
        await this.scoreService.vote(
            req.user.sub,
            voteScoreDto.postId,
            voteScoreDto.value,
        );
    }
}