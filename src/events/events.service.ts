import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { ILike, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";

type EventError = 
    | "EVENT DOESNT EXIST"
    | "TIMESTAMP INVALID";

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
    ) { }

    async create(createEventDto: CreateEventDto) {
        try {
            const user = new User();
            user.username = createEventDto.username;
            await this.eventRepository.save({
                ...createEventDto,
                user
            });
        } catch (e) {
            const error = e as Error;

            if (error.message.includes("timestamp")) {
                throw new EventException("TIMESTAMP INVALID");
            }
        }
    }

    async findAll() {
        return await this.eventRepository.find();
    }

    async findOne(id: number) {
        const event = await this.eventRepository.findOneBy({ id });

        if (event) {
            return event;
        } else {
            throw new EventException("EVENT DOESNT EXIST");
        }
    }

    async find(title: string) {
        return await this.eventRepository.find({
            where: {
                title: ILike(title)
            }
        });
    }

    async update(id: number, updateEventDto: UpdateEventDto) {
        return (await this.eventRepository.update(id, updateEventDto))!.affected! > 0;
    }

    async remove(id: number) {
        return (await this.eventRepository.delete(id)).affected! > 0;
    }
}
