import { beforeEach, describe, expect, it } from "vitest";
import { AuthController } from "./auth.controller";
import { AuthException, AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { LoginDTO } from "./dto/login.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

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
            .toStrictEqual({ token: "jwt" });
    });

    it("should return status unauthorized with wrong credentials", () => {
        mockAuth.signIn = async () => {
            throw new AuthException("WRONG CREDENTIALS");
        };

        expect(controller.login(new LoginDTO()))
            .rejects
            .toThrow(new HttpException("WRONG CREDENTIALS", HttpStatus.UNAUTHORIZED));
    });

    it("should rethrows with unknown error", () => {
        mockAuth.signIn = async () => {
            throw new Error("unknown");
        };

        expect(controller.login(new LoginDTO()))
            .rejects
            .toThrow("unknown");
    });
});