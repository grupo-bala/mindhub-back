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

        return this.findOne(id);
    }

    async findAll() {
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
                userScore: 0,
            }))
        );
    }

    async findOne(id: number) {
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
                userScore: 0,
            };
        } else {
            throw new EventException("EVENT DOESNT EXIST");
        }
    }

    async find(username: string) {
        const events = await this.eventRepository.find({
            where: {
                user: {
                    username
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
                userScore: 0,
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
