import { InjectRepository } from "@nestjs/typeorm";
import { Score } from "./entities/score.entity";
import { Repository } from "typeorm";

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
}