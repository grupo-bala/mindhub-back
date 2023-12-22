import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entities/comment.entity";
import { Equal, IsNull, Repository } from "typeorm";
import { ScoreService } from "src/score/score.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CreateCommentReplyDto } from "./dto/create-comment-reply.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { UpdateBestAnswerDto } from "./dto/update-best-answer.dto";
import { AskService } from "src/ask/ask.service";

type CommentError =
    | "POST DOESNT EXIST"
    | "COMMENT DOESNT EXIST"
    | "COMMENT TO REPLY OR POST DOESNT EXIST";

export class CommentException extends Error {
    name: CommentError;

    constructor(name: CommentError) {
        super();
        this.name = name;
    }
}

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @Inject(forwardRef(() => AskService))
        private askService: AskService,
        @Inject(forwardRef(() => ScoreService))
        private scoreService: ScoreService,
    ) {}

    async createComment(
        { postId, content }: CreateCommentDto,
        username: string,
    ) {
        try {
            const { id } = await this.commentRepository.save({
                user: {
                    username
                },
                post: {
                    id: postId
                },
                content,
                isBestAnswer: false,
            });

            return this.findOne(id, username);
        } catch (e) {
            throw new CommentException("POST DOESNT EXIST");
        }
    }

    async createCommentReply(
        { postId, replyTo, content }: CreateCommentReplyDto,
        username: string,
    ) {
        try {
            const { id } = await this.commentRepository.save({
                user: {
                    username,
                },
                post: {
                    id: postId,
                },
                replyTo: {
                    id: replyTo,
                },
                content,
                isBestAnswer: false,
            });

            return this.findOne(id, username);
        } catch (e) {
            throw new CommentException(
                "COMMENT TO REPLY OR POST DOESNT EXIST"
            );
        }
    }

    async removeComment(id: number, username: string): Promise<boolean> {
        return (
            await this.commentRepository.delete({
                id,
                user: {
                    username,
                },
            })
        )!.affected! > 0;
    }

    async findOne(id: number, username: string) {
        const comment = await this.commentRepository.findOne({
            where: {
                id,
            },
            relations: {
                user: true,
                post: true,
                replies: true,
            },
        });

        if (comment) {
            return {
                ...comment,
                user: comment.user.username,
                post: comment.post.id,
                replies: comment.replies.map((reply) => ({
                    ...reply,
                    user: reply.user.username,
                    post: reply.post.id,
                    replyTo: reply.replyTo ? reply.replyTo.id : null,
                    replies: [],
                    score: 0,
                    userScore: 0,
                })),
                replyTo: comment.replyTo ? comment.replyTo.id : null,
                score: await this.scoreService.getCommentScore(comment.id),
                userScore: await this.scoreService.getUserScoreOnComment(comment.id, username) ?? 0,
            };
        } else {
            throw new CommentException("COMMENT DOESNT EXIST");
        }
    }

    async findAll(postId: number, username: string) {
        const comments = await this.commentRepository.find({
            where: {
                post: {
                    id: postId,
                },
                replyTo: IsNull(),
            },
            relations: {
                user: true,
                post: true,
                replies: {
                    post: true,
                    user: true,
                },
                replyTo: true,
            },
        });

        return Promise.all(
            comments.map(async (comment) => ({
                ...comment,
                user: comment.user.username,
                post: comment.post.id,
                replies: comment.replies.map((reply) => ({
                    ...reply,
                    user: reply.user.username,
                    post: reply.post.id,
                    replyTo: reply.replyTo ? reply.replyTo.id : null,
                    replies: [],
                    score: 0,
                    userScore: 0,
                })),
                replyTo: comment.replyTo ? comment.replyTo.id : null,
                score: await this.scoreService.getCommentScore(comment.id),
                userScore: await this.scoreService.getUserScoreOnComment(comment.id, username) ?? 0,
            })),
        );
    }

    async updateComment(
        id: number,
        username: string,
        updateCommentDto: UpdateCommentDto
    ) {
        return (
            await this.commentRepository.update({
                id,
                user: {
                    username,
                },

            }, updateCommentDto)
        )!.affected! > 0;
    }

    async updateBestAnswer(
        id: number,
        updateBestAnswerDto: UpdateBestAnswerDto,
    ) {
        const bestAnswerComment = await this.commentRepository.findOne({
            where: {
                post: {
                    id: updateBestAnswerDto.postId,
                },
                isBestAnswer: Equal(true),
            },
        });

        if (bestAnswerComment === null) {
            this.askService.updateHasBestAnswer(updateBestAnswerDto.postId, true);

            return (
                await this.commentRepository.update({
                    id,
                    post: {
                        id: updateBestAnswerDto.postId,
                    },
                }, {
                    isBestAnswer: true,
                })
            ).affected! > 0;
        }

        await this.commentRepository.update({
            id: bestAnswerComment.id,
        }, {
            isBestAnswer: false,
        });

        if (id === bestAnswerComment.id) {
            this.askService.updateHasBestAnswer(updateBestAnswerDto.postId, false);

            return true;
        }

        this.askService.updateHasBestAnswer(updateBestAnswerDto.postId, true);

        return (
            await this.commentRepository.update({
                id,
                post: {
                    id: updateBestAnswerDto.postId,
                },
            }, {
                isBestAnswer: true,
            })
        ).affected! > 0;
    }
}
