import { beforeEach, describe, expect, it } from "vitest";
import { ExpertiseController } from "./expertise.controller";
import { ExpertiseException, ExpertiseService } from "./expertise.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Expertise } from "./entities/expertise.entity";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("ExpertiseController", () => {
    let controller: ExpertiseController;
    let mockExpertise: Partial<ExpertiseService> = {};

    beforeEach(async () => {
        mockExpertise = {};

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExpertiseController],
            providers: [
                {
                    provide: ExpertiseService,
                    useValue: mockExpertise,
                },
            ],
        }).compile();

        controller = module.get<ExpertiseController>(ExpertiseController);
    });

    it("should return all expertises", () => {
        const expertises = [new Expertise(), new Expertise()];

        mockExpertise.findAll = async () => expertises;

        expect(controller.findAll())
            .resolves
            .toStrictEqual({ expertises });
    });

    it("should return the correct expertise", () => {
        const expertise = new Expertise();

        mockExpertise.findOne = async () => expertise;

        expect(controller.findOne("teste"))
            .resolves
            .toStrictEqual({ expertise });
    });

    it("should return not found status with non existent expertise", () => {
        mockExpertise.findOne = async () => {
            throw new ExpertiseException("EXPERTISE DOESNT EXIST");
        };

        expect(controller.findOne("teste"))
            .rejects
            .toThrow(new HttpException("EXPERTISE DOESNT EXIST", HttpStatus.NOT_FOUND));
    });

    it("should rethrows with unknown error", () => {
        mockExpertise.findOne = async () => {
            throw new Error("unknown");
        };

        expect(controller.findOne("teste"))
            .rejects
            .toThrow("unknown");
    });
});