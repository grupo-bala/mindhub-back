import { beforeEach, describe, expect, it } from "vitest";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { LoginDTO } from "./dto/login.dto";

describe("AuthController", () => {
    let controller: AuthController;
    let mockAuth: Partial<AuthService> = {};

    beforeEach(async () => {
        mockAuth = {};

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuth,
                }
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it("should return jwt on login", () => {
        mockAuth.signIn = async () => "jwt";

        expect(controller.login(new LoginDTO()))
            .resolves
            .toBe("jwt");
    });
});