import { Test, TestingModule } from "@nestjs/testing";
import { MaterialController } from "./material.controller";
import { MaterialException, MaterialService } from "./material.service";
import { describe, beforeEach, it, expect } from "vitest";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { ExpertiseException } from "src/expertise/expertise.service";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Material } from "./entities/material.entity";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { User } from "src/user/entities/user.entity";

describe("MaterialController", () => {
    let controller: MaterialController;
    let mockService: Partial<MaterialService> = {};

    beforeEach(async () => {
        mockService = {};

        const module: TestingModule = await Test.createTestingModule({
            controllers: [MaterialController],
            providers: [
                {
                    provide: MaterialService,
                    useValue: mockService,
                }
            ],
        }).compile();

        controller = module.get<MaterialController>(MaterialController);
    });

    it("should not throws when save material on post", () => {
        const materialDto = new CreateMaterialDto();

        mockService.create = async () => {};

        expect(controller.create(materialDto))
            .resolves
            .not
            .toThrow();
    });

    it("should return status not found with expertise error", () => {
        const materialDto = new CreateMaterialDto();

        mockService.create = async () => {
            throw new ExpertiseException("EXPERTISE DOESNT EXIST");
        };

        expect(controller.create(materialDto))
            .rejects
            .toThrow(new HttpException("EXPERTISE DOESNT EXIST", HttpStatus.NOT_FOUND));
    });

    it("should rethrows with unknown error on create", () => {
        const materialDto = new CreateMaterialDto();

        mockService.create = async () => {
            throw new Error("unknown");
        };

        expect(controller.create(materialDto))
            .rejects
            .toThrow("unknown");
    });

    it("should return all materials on get all", () => {
        mockService.findAll = async () => {
            return [new Material(), new Material(), new Material()];  
        };

        expect(controller.findAll())
            .resolves
            .toHaveLength(3);
    });

    it("should return the correct material on get based on id", () => {
        const material = new Material();
        
        mockService.findOne = async () => material;

        expect(controller.findOne("1"))
            .resolves
            .toSatisfy(({ id }: Material) => id === material.id);
    });

    it("should return the correct material on get based on user", () => {
        const material1 = new Material();
        material1.user = new User();

        const material2 = new Material();
        material2.user = new User();

        mockService.find = async () => [material1, material2];

        expect(controller.find("test"))
            .resolves
            .toHaveLength(2);
    });

    it("should return status not found with non existence material error", () => {
        mockService.findOne = async () => {
            throw new MaterialException("MATERIAL DOESNT EXIST");
        };

        expect(controller.findOne("1"))
            .rejects
            .toThrow(new HttpException("MATERIAL DOESNT EXIST", HttpStatus.NOT_FOUND));
    });

    it("should rethrows with unknown error on find", () => {
        mockService.findOne = async () => {
            throw new Error("unknown");
        };

        expect(controller.findOne("1"))
            .rejects
            .toThrow("unknown");
    });

    it("should not throws in patch", () => {
        mockService.update = async () => true;

        expect(controller.update("sum", new UpdateMaterialDto()))
            .resolves
            .not.toThrow();
    });

    it("should not throws on delete", () => {
        mockService.remove = async () => true;

        expect(controller.remove("1"))
            .resolves
            .not.toThrow();
    });
});
