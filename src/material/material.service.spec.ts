import { Test, TestingModule } from "@nestjs/testing";
import { MaterialException, MaterialService } from "./material.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Material } from "./entities/material.entity";
import { describe, beforeEach, it, expect } from "vitest";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { ExpertiseException } from "src/expertise/expertise.service";
import { UpdateMaterialDto } from "./dto/update-material.dto";

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
                }
            ],
        }).compile();

        service = module.get<MaterialService>(MaterialService);
    });

    it("should save correct material", () => {
        const material = new CreateMaterialDto();
        material.expertise = [""];
        
        mockRepository.save = async () => [];

        expect(() => service.create(material))
            .not.toThrow();
    });

    it("should throw with no expertise", () => {
        const material = new CreateMaterialDto();
        material.expertise = [];

        mockRepository.save = async () => {
            throw new Error();
        };

        expect(service.create(material))
            .rejects
            .toThrow(new MaterialException("MATERIAL NEED ONE EXPERTISE"));
    });

    it("should throw with 2 expertises", () => {
        const material = new CreateMaterialDto();
        material.expertise = ["", ""];

        mockRepository.save = async () => {
            throw new Error();
        };

        expect(service.create(material))
            .rejects
            .toThrow(new MaterialException("MATERIAL MAY HAVE ONLY 1 EXPERTISE"));
    });
    
    it("should throw with non existence expertise", async () => {
        const material = new CreateMaterialDto();
        material.expertise = [""];
        
        mockRepository.save = async () => {
            throw new Error();
        };
        
        await expect(service.create(material))
            .rejects
            .toThrow(new ExpertiseException("EXPERTISE DOESNT EXIST"));
    });
    
    it("should return all materials", () => {
        mockRepository.find = async () => {
            return [new Material(), new Material(), new Material()];
        };

        expect(service.findAll())
            .resolves
            .toHaveLength(3);
    });

    it("should return materials based on title", () => {
        mockRepository.findBy = async () => {
            return [new Material(), new Material()];
        };

        expect(service.find("sum of square roots"))
            .resolves
            .toHaveLength(2);
    });

    it("should return null for non existence material based on id", () => {
        mockRepository.findOneBy = async () => {
            return null;
        };

        expect(service.findOne(1))
            .rejects
            .toThrow(new MaterialException("MATERIAL DOESNT EXIST"));
    });
    
    it("should return null for non existence materials based on title", () => {
        mockRepository.findBy = async () => [];

        expect(service.find("sum of square roots"))
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

        expect(service.update(1, material))
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

        expect(service.update(1, material))
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

        expect(service.remove(1))
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

        expect(service.remove(1))
            .resolves
            .toBeFalsy();
    });
});
