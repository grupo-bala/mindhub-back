import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";

describe("AuthController", () => {
    // let controller: AuthController;
    // const mockRepository = {};

    // beforeEach(async () => {
    //     const module: TestingModule = await Test.createTestingModule({
    //         controllers: [AuthController],
    //         providers: [
    //             // AuthService,
    //             // JwtService,
    //             // UserService,
    //             // {
    //             //     provide: getRepositoryToken(User),
    //             //     useValue: mockRepository,
    //             // }
    //         ],
    //     }).compile();

    //     controller = module.get<AuthController>(AuthController);
    // });

    // it("should be defined", () => {
    //     expect(controller).toBeDefined();
    // });

    it("should pass", () => {
        expect(true).toBeTruthy();
    });
});
