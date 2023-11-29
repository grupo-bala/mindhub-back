import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ScoreService } from "./score.service";
import { AuthGuard, Request } from "src/auth/auth.guard";
import { VoteScoreDto } from "./dto/vote-score.dto";
import { VoteScoreCommentDto } from "./dto/vote-score-comment.dto";

@ApiTags("score")
@ApiBearerAuth()
@Controller("score")
export class ScoreController {
    constructor(
        private readonly scoreService: ScoreService,
    ) {}

    @Post("/post")
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

    @Post("/comment")
    @UseGuards(AuthGuard)
    async voteComment(
        @Body() voteScoreDto: VoteScoreCommentDto,
        @Req() req: Request,
    ) {
        await this.scoreService.voteComment(
            req.user.sub,
            voteScoreDto.commentId,
            voteScoreDto.value,
        );
    }
}