import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CommentException, CommentService } from "./comment.service";
import { AuthGuard, Request } from "src/auth/auth.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreateCommentReplyDto } from "./dto/create-comment-reply.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { instanceToPlain } from "class-transformer";
import { UpdateBestAnswerDto } from "./dto/update-best-answer.dto";

@ApiTags("comment")
@ApiBearerAuth()
@Controller("comment")
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async createComment(
        @Body() createCommentDto: CreateCommentDto,
        @Req() req: Request,
    ) {
        try {
            return instanceToPlain(
                await this.commentService.createComment(createCommentDto, req.user.sub),
            );
        } catch (e) {
            if (e instanceof CommentException) {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @Post("/reply")
    @UseGuards(AuthGuard)
    async createCommentReply(
        @Body() createCommentReplyDto: CreateCommentReplyDto,
        @Req() req: Request,
    ) {
        try {
            return instanceToPlain(
                await this.commentService.createCommentReply(createCommentReplyDto, req.user.sub),
            );
        } catch (e) {
            if (e instanceof CommentException) {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async removeComment(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        await this.commentService.removeComment(id, req.user.sub);
    }

    @Get(":postId")
    @UseGuards(AuthGuard)
    async findAll(
        @Param("postId", ParseIntPipe) postId: number,
        @Req() req: Request,
    ) {
        return instanceToPlain(await this.commentService.findAll(postId, req.user.sub));
    }

    @Patch(":id")
    @UseGuards(AuthGuard)
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateCommentDto: UpdateCommentDto,
        @Req() req: Request,
    ) {
        await this.commentService.updateComment(id, req.user.sub, updateCommentDto);
    }

    @Patch("/best-answer/:id")
    @UseGuards(AuthGuard)
    async updateBestAnswer(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateBestAnswerDto: UpdateBestAnswerDto,
    ) {
        await this.commentService.updateBestAnswer(id, updateBestAnswerDto);
    }
}
