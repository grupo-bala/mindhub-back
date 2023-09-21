import { describe, it, expect, beforeEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "src/auth/auth.service";

type Mock = Partial<Repository<User>>;

describe("UserController", () => {
    let controller: UserController;
    const mockRepository: Mock = {};
    let mockAuth: Partial<AuthService> = {};

    beforeEach(async () => {
        mockAuth = {};

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
                {
                    provide: AuthService,
                    useValue: mockAuth,
                }
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
