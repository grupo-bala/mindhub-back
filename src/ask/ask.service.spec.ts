import { Test, TestingModule } from "@nestjs/testing";
import { AskService } from "./ask.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Ask } from "./entities/ask.entity";
import { ScoreService } from "src/score/score.service";
import { describe, beforeEach, it, expect } from "vitest";
import { CreateMaterialDto } from "src/material/dto/create-material.dto";
import { CreateAskDto } from "./dto/create-ask.dto";
import { ExpertiseException } from "src/expertise/expertise.service";

describe("AskService", () => {
    let service: AskService;
    let mockRepository: Partial<Repository<Ask>> = {};

    beforeEach(async () => {
        mockRepository = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AskService,
                {
                    provide: getRepositoryToken(Ask),
                    useValue: mockRepository
                },
                {
                    provide: ScoreService,
                    useValue: {
                        getPostScore: async () => 0,
                        getUserScoreOnPost: async () => 0,
                    }
                },
            ],
        }).compile();

        service = module.get<AskService>(AskService);
    });

    it("should save correct ask", () => {
        const ask = new CreateMaterialDto();

        mockRepository.save = async () => [];
        mockRepository.findOne = async () => {
            return new Ask();
        };

        expect(() => service.create(ask, "teste"))
            .not.toThrow();
    });

    it("should throw with no existence expertise", async () => {
        const ask = new CreateAskDto();
        ask.expertise = "";

        mockRepository.save = async () => {
            throw new Error();
        };

        await expect(service.create(ask, "teste"))
            .rejects
            .toThrow(new ExpertiseException("EXPERTISE DOESNT EXIST"));
    });

    it("should return asks based on user", () => {
        mockRepository.find = async () => {
            return [new Ask(), new Ask()];
        };

        expect(service.find("test", "teste"))
            .resolves
            .toHaveLength(2);
    });

    it("should return all asks", () => {
        mockRepository.find = async () => {
            return [new Ask(), new Ask(), new Ask()];
        };

        expect(service.findAll("teste"))
            .resolves
            .toHaveLength(3);
    });
});
