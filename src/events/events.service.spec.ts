import { beforeEach, describe, expect, it } from "vitest";
import { EventException, EventsService } from "./events.service";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";

describe("EventsService", () => {
    let service: EventsService;
    let mockRepository: Partial<Repository<Event>> = {};

    beforeEach(async () => {
        mockRepository = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getRepositoryToken(Event),
                    useValue: mockRepository
                }
            ],
        }).compile();

        service = module.get<EventsService>(EventsService);
    });

    it("should save correct event", () => {
        const event = new CreateEventDto();

        mockRepository.save = async () => [];

        expect(() => service.create(event, "teste"))
            .not.toThrow();
    });

    it("should return all events", () => {
        mockRepository.find = async () => {
            return [new Event(), new Event(), new Event()];
        };

        expect(service.findAll())
            .resolves
            .toHaveLength(3);
    });

    it("should return events by title", () => {
        mockRepository.find = async () => {
            return [new Event(), new Event()];
        };

        expect(service.find("wtisc"))
            .resolves
            .toHaveLength(2);
    });

    it("should return event by id", () => {
        const event = new Event();
        mockRepository.findOneBy = async () => event;

        expect(service.findOne(0))
            .resolves
            .toBe(event);
    });

    it("should throw with non existence event by id", () => {
        mockRepository.findOneBy = async () => null;

        expect(service.findOne(1))
            .rejects
            .toThrow(new EventException("EVENT DOESNT EXIST"));
    });

    it("should return true when updating 1 event", () => {
        const event = new UpdateEventDto();
        
        mockRepository.update = async () => {
            return {
                affected: 1,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.update(1, event))
            .resolves
            .toBeTruthy();
    });

    it("should return false when updating no event", () => {
        const event = new UpdateEventDto();
        
        mockRepository.update = async () => {
            return {
                affected: 0,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.update(1, event))
            .resolves
            .toBeFalsy();
    });

    it("should return true when deleting 1 event", () => {
        mockRepository.delete = async () => {
            return {
                affected: 1,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.remove(1))
            .resolves
            .toBeTruthy();
    });

    it("should return false when deleting no event", () => {
        mockRepository.delete = async () => {
            return {
                affected: 0,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.remove(1))
            .resolves
            .toBeFalsy();
    });
});