import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { Repository } from "typeorm";
import { ScoreService } from "src/score/score.service";

type EventError = 
    | "EVENT DOESNT EXIST";

export class EventException extends Error {
    name: EventError;

    constructor(name: EventError) {
        super();
        this.name = name;
    }
}

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
        private scoreService: ScoreService,
    ) { }

    async create(createEventDto: CreateEventDto, username: string): Promise<Event> {
        const { id } = await this.eventRepository.save({
            user: { username },
            ...createEventDto,
        });

        return this.findOne(id, username);
    }

    async findAll(username: string) {
        const events = await this.eventRepository.find({
            relations: {
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                },
            }
        });

        return Promise.all(
            events.map(async event => ({
                ...event,
                score: await this.scoreService.getPostScore(event.id),
                userScore: await this.scoreService.getUserScoreOnPost(event.id, username),
            }))
        );
    }

    async findOne(id: number, username: string) {
        const event = await this.eventRepository.findOne({
            where: {
                id
            },
            relations: {
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                },
            },
        });

        if (event) {
            return {
                ...event,
                score: await this.scoreService.getPostScore(id),
                userScore: await this.scoreService.getUserScoreOnPost(id, username),
            };
        } else {
            throw new EventException("EVENT DOESNT EXIST");
        }
    }

    async getRecents(username: string) {
        const events = await this.eventRepository.find({
            relations: {
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
            events.map(async event => ({
                ...event,
                score: await this.scoreService.getPostScore(event.id),
                userScore: await this.scoreService.getUserScoreOnPost(event.id, username) ?? 0
            }))
        );
    }

    async find(usernameTarget: string, usernameViewer: string) {
        const events = await this.eventRepository.find({
            where: {
                user: {
                    username: usernameTarget,
                },
            },
            relations: {
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                },
            },
        });

        return Promise.all(
            events.map(async event => ({
                ...event,
                score: await this.scoreService.getPostScore(event.id),
                userScore: await this.scoreService.getUserScoreOnPost(event.id, usernameViewer),
            }))
        );
    }

    async update(id: number, username: string, updateEventDto: UpdateEventDto) {
        return (await this.eventRepository.update({ id, user: { username } }, updateEventDto))!.affected! > 0;
    }

    async remove(id: number, username: string) {
        return (await this.eventRepository.delete({ id, user: { username } })).affected! > 0;
    }
}
