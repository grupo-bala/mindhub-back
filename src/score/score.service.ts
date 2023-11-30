import { InjectRepository } from "@nestjs/typeorm";
import { Score } from "./entities/score.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { CommentService } from "src/comment/comment.service";
import { Post } from "src/post/entities/post.entity";

@Injectable()
export class ScoreService {
    constructor(
        @InjectRepository(Score)
        private scoreRepository: Repository<Score>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        private userService: UserService,
        private commentService: CommentService,
    ) { }

    async getPostScore(id: number): Promise<number> {
        return await this.scoreRepository.sum("value", {
            post: {
                id
            },
        }) ?? 0;
    }

    async getCommentScore(id: number): Promise<number> {
        return await this.scoreRepository.sum("value", {
            comment: {
                id,
            }
        }) ?? 0;
    }

    async getUserScoreOnPost(id: number, username: string) {
        const score = await this.scoreRepository.findOne({
            where: {
                post: {
                    id,
                },
                user: {
                    username,
                },
            },
        });

        return score?.value;
    }

    async getUserScoreOnComment(id: number, username: string) {
        const score = await this.scoreRepository.findOne({
            where: {
                comment: {
                    id,
                },
                user: {
                    username,
                },
            },
        });

        return score?.value;
    }

    async vote(username: string, postId: number, value: number) {
        const currentScore = await this.getUserScoreOnPost(postId, username);

        if (currentScore === undefined) {
            await this.scoreRepository.save({
                value,
                user: { username },
                post: { id: postId },
            });
        } else {
            await this.scoreRepository.update(
                { user: { username } , post: { id: postId }},
                { value }
            );
        }

        const post = await this.postRepository.findOne({
            where: {
                id: postId,
            },
            relations: {
                user: true,
            },
        });

        if (value === 0) {
            await this.userService.addXp(post!.user.username, -currentScore!);
        } else {
            await this.userService.addXp(post!.user.username, value);
        }
    }

    async voteComment(username: string, commentId: number, value: number) {
        const currentScore = await this.getUserScoreOnComment(commentId, username);

        if (currentScore === undefined) {
            await this.scoreRepository.save({
                value,
                user: { username },
                comment: { id: commentId },
            });
        } else {
            await this.scoreRepository.update(
                { user: { username }, comment: { id: commentId } },
                { value }
            );
        }

        const comment = await this.commentService.findOne(commentId, username);
        
        if (value === 0) {
            await this.userService.addXp(comment!.user, -currentScore!);
        } else {
            await this.userService.addXp(comment!.user, value);
        }
    }
}