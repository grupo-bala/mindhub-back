import { Test, TestingModule } from "@nestjs/testing";
import { MaterialException, MaterialService } from "./material.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Material } from "./entities/material.entity";
import { describe, beforeEach, it, expect } from "vitest";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { ExpertiseException } from "src/expertise/expertise.service";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { ScoreService } from "src/score/score.service";

describe("MaterialService", () => {
    let service: MaterialService;
    let mockRepository: Partial<Repository<Material>> = {};

    beforeEach(async () => {
        mockRepository = {};
        
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MaterialService,
                {
                    provide: getRepositoryToken(Material),
                    useValue: mockRepository
                },
                {
                    provide: ScoreService,
                    useValue: {
                        getPostScore: async () => 0,
                        getUserScoreOnPost: async () => 0,
                    },
                },
            ],
        }).compile();

        service = module.get<MaterialService>(MaterialService);
    });

    it("should save correct material", () => {
        const material = new CreateMaterialDto();
        
        mockRepository.save = async () => [];
        mockRepository.findOne = async () => {
            return new Material();
        };

        expect(() => service.create(material, "teste"))
            .not.toThrow();
    });
    
    it("should throw with non existence expertise", async () => {
        const material = new CreateMaterialDto();
        material.expertise = "";
        
        mockRepository.save = async () => {
            throw new Error();
        };
        
        await expect(service.create(material, "teste"))
            .rejects
            .toThrow(new ExpertiseException("EXPERTISE DOESNT EXIST"));
    });
    
    it("should return all materials", () => {
        mockRepository.find = async () => {
            return [new Material(), new Material(), new Material()];
        };

        expect(service.findAll("teste"))
            .resolves
            .toHaveLength(3);
    });

    it("should return materials based on user", () => {
        mockRepository.find = async () => {
            return [new Material(), new Material()];
        };

        expect(service.find("test", "teste"))
            .resolves
            .toHaveLength(2);
    });

    it("should return null for non existence material based on id", () => {
        mockRepository.findOne = async () => {
            return null;
        };

        expect(service.findOne(1, "teste"))
            .rejects
            .toThrow(new MaterialException("MATERIAL DOESNT EXIST"));
    });

    it("should return true when updating 1 material", () => {
        const material = new UpdateMaterialDto();
        
        mockRepository.update = async () => {
            return {
                affected: 1,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.update(1, "teste", material))
            .resolves
            .toBeTruthy();
    });

    it("should return false when updating no material", () => {
        const material = new UpdateMaterialDto();
        
        mockRepository.update = async () => {
            return {
                affected: 0,
                generatedMaps: [],
                raw: {},
            };
        };
        
        expect(service.update(1, "teste", material))
            .resolves
            .toBeFalsy();
    });

    it("should return true when deleting 1 material", () => {
        mockRepository.delete = async () => {
            return {
                affected: 1,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.remove(1, "teste"))
            .resolves
            .toBeTruthy();
    });

    it("should return false when deleting no material", () => {
        mockRepository.delete = async () => {
            return {
                affected: 0,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.remove(1, "teste"))
            .resolves
            .toBeFalsy();
    });

    it("should return materials ordered by user expertises and most voted"), () => {
        mockRepository.find = async () => {
            return [new Material(), new Material()];
        };

        expect(service.getForYou("teste"))
            .resolves
            .toHaveLength(2);
    };

    it("should return materials ordered by most recent date post"), () => {
        mockRepository.find = async () => {
            const material1 = new Material();
            const material2 = new Material();

            material1.postDate = "12";
            material2.postDate = "10";

            return [material2, material1];
        };

        expect(service.getRecents("teste"))
            .resolves
            .toHaveLength(2);
    };
});
