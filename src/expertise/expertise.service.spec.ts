import { beforeEach, describe, expect, it } from "vitest";
import { ExpertiseException, ExpertiseService } from "./expertise.service";
import { Repository } from "typeorm";
import { Expertise } from "./entities/expertise.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ExpertiseService", () => {
    let service: ExpertiseService;
    let mockRepository: Partial<Repository<Expertise>> = {};

    beforeEach(async () => {
        mockRepository = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExpertiseService,
                {
                    provide: getRepositoryToken(Expertise),
                    useValue: mockRepository,
                }
            ]
        }).compile();

        service = module.get<ExpertiseService>(ExpertiseService);
    });

    it("should return all expertises", () => {
        const expertises = [new Expertise(), new Expertise()];

        mockRepository.find = async () => expertises;

        expect(service.findAll())
            .resolves
            .toBe(expertises);
    });

    it("should return the correct expertise", () => {
        const expertise = new Expertise();
        expertise.title = "Matemática";

        mockRepository.findOneBy = async () => expertise;

        expect(service.findOne("Matemática"))
            .resolves
            .toBe(expertise);
    });

    it("should throws with non existent expertise", () => {
        mockRepository.findOneBy = async () => null;

        expect(service.findOne("Matemática"))
            .rejects
            .toThrow(new ExpertiseException("EXPERTISE DOESNT EXIST"));
    });
});