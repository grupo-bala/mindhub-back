import { Injectable } from "@nestjs/common";
import { CreateAskDto } from "./dto/create-ask.dto";
import { UpdateAskDto } from "./dto/update-ask.dto";
import { Ask } from "./entities/ask.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { ScoreService } from "src/score/score.service";
import { ExpertiseException } from "src/expertise/expertise.service";
import { Expertise } from "src/expertise/entities/expertise.entity";

type AskError =
    | "ASK DOESNT EXIST";

export class AskException extends Error {
    name: AskError;

    constructor(name: AskError) {
        super();
        this.name = name;
    }
}

@Injectable()
export class AskService {
    constructor(
        @InjectRepository(Ask)
        private askRespository: Repository<Ask>,
        private scoreService: ScoreService,
    ) { }

    async create(
        { title, content, expertise, postDate, hasImage} : CreateAskDto,
        username: string
    ): Promise<Ask> {
        try {
            const { id } = await this.askRespository.save({
                user: { username },
                title,
                content,
                hasImage,
                postDate,
                expertise: {
                    title: expertise,
                    users: [],
                },
            });

            return this.findOne(id, username);
        } catch (error) {
            throw new ExpertiseException("EXPERTISE DOESNT EXIST");
        }
    }

    async findAll(username: string) {
        const asks = await this.askRespository.find({
            relations: {
                expertise: true,
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                }
            }
        });

        return Promise.all(
            asks.map(async ask => ({
                ...ask,
                score: await this.scoreService.getPostScore(ask.id),
                userScore: await this.scoreService.getUserScoreOnPost(ask.id, username) ?? 0
            }))
        );
    }

    async find(username: string, pattern: string) {
        const asks = await this.askRespository.find({
            relations: {
                expertise: true,
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                }
            },
            where: {
                title: Like(pattern)
            }
        });

        return Promise.all(
            asks.map(async ask => ({
                ...ask,
                score: await this.scoreService.getPostScore(ask.id),
                userScore: await this.scoreService.getUserScoreOnPost(ask.id, username) ?? 0
            }))
        );
    }

    async getRecents(username: string) {
        const asks = await this.askRespository.find({
            relations: {
                expertise: true,
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                },
            },
            order: {
                postDate: "DESC"
            }
        });

        return Promise.all(
            asks.map(async ask => ({
                ...ask,
                score: await this.scoreService.getPostScore(ask.id),
                userScore: await this.scoreService.getUserScoreOnPost(ask.id, username) ?? 0
            }))
        );
    }

    async findByUser(usernameTarget: string, usernameViewer: string) {
        const asks = await this.askRespository.find({
            where: {
                user: {
                    username: usernameTarget,
                }
            },
            relations: {
                expertise: true,
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                },
            },
        });

        return Promise.all(
            asks.map(async ask => ({
                ...ask,
                score: await this.scoreService.getPostScore(ask.id),
                userScore: await this.scoreService.getUserScoreOnPost(ask.id, usernameViewer) ?? 0
            }))
        );
    }

    async findOne(id: number, username: string) {
        const ask = await this.askRespository.findOne({
            where: {
                id
            },
            relations: {
                expertise: true,
                user : {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                }
            }
        });

        if (ask) {
            return {
                ...ask,
                score: await this.scoreService.getPostScore(id),
                userScore: await this.scoreService.getUserScoreOnPost(id, username) ?? 0
            };
        } else {
            throw new AskException("ASK DOESNT EXIST");
        }
    }

    async update(id: number, username: string, updateAskDto: UpdateAskDto) {
        const expertiseEntity = new Expertise();
        expertiseEntity.title = updateAskDto.expertise ?? "";

        const parsedDto = {
            ...updateAskDto,
            expertise: expertiseEntity,
        };

        return (
            await this.askRespository.update({ id, user: { username } }, parsedDto)
        )!.affected! > 0;
    }

    async remove(id: number, username: string) {
        return (
            await this.askRespository.delete({ id, user: { username } })
        )!.affected! > 0;
    }
}
