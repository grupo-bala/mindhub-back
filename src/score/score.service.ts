import { InjectRepository } from "@nestjs/typeorm";
import { Score } from "./entities/score.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ScoreService {
    constructor(
        @InjectRepository(Score)
        private scoreRepository: Repository<Score>
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
                { user: { username } },
                { value }
            );
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
                { user: { username } },
                { value }
            );
        }
    }
}