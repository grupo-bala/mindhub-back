import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { LessThan, MoreThanOrEqual, Repository } from "typeorm";

type RankingError =
    | "USER DOESNT EXIST";

export class RankingException extends Error {
    name: RankingError;

    constructor(name: RankingError) {
        super();
        this.name = name;
    }
}

@Injectable()
export class RankingService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findAll() {
        const leaderboard = await this.userRepository.find({
            relations: {
                badges: true,
                currentBadge: true,
            },
            order: {
                xp: "DESC",
                id: "ASC",
            },
            take: 100,
        });

        return leaderboard.map((user) => ({
            username: user.username,
            name: user.name,
            xp: user.xp,
        }));
    }

    async getRank(username: string): Promise<number> {
        const user = await this.userRepository
            .findOne({
                where: {
                    username,
                },
            });

        if (user === null) {
            throw new RankingException("USER DOESNT EXIST");
        }
        
        return await this.userRepository
            .count({
                where: {
                    xp: MoreThanOrEqual(user.xp),
                    id: LessThan(user.id),
                }
            }) + 1;
    }
}