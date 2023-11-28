import { describe, beforeEach, it, expect } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthException, AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserService, UserException } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { ConfigModule } from "@nestjs/config";

describe("AuthService", () => {
    let service: AuthService;
    let userMock: Partial<UserService> = {};

    beforeEach(async () => {
        userMock = {};

        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: async () => "token",
                    },
                },
                {
                    provide: UserService,
                    useValue: userMock,
                }
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it("should throw with non existing email", () => {
        userMock.findOneByEmail = async () => {
            throw new UserException("USER DOESNT EXIST");
        };

        expect(service.signIn("teste", "teste"))
            .rejects
            .toThrow(new AuthException("WRONG CREDENTIALS"));
    });

    it("should throw with wrong password", () => {
        const user = new User();
        user.username = "teste";
        user.hashPassword = "$2b$10$WKJWHItbja91yJsgC/XIb.GSr7Og7jREjEsRLTbrmiru6J7YEPodi";

        userMock.findOneByEmail = async () => user;

        expect(service.signIn("teste", "teste123"))
            .rejects
            .toThrow();
    });

    it("should pass with correct password", () => {
        const user = new User();
        user.username = "teste";
        user.hashPassword = "$2b$10$WKJWHItbja91yJsgC/XIb.GSr7Og7jREjEsRLTbrmiru6J7YEPodi";

        userMock.findOneByEmail = async () => user;

        expect(service.signIn("teste", "teste"))
            .resolves
            .not.toThrow();
    });

    it("should return a hash and jwt token", async () => {
        expect(service.signUp("teste", "teste"))
            .resolves
            .toSatisfy((value: object) => "hash" in value && "jwt" in value);
    });
});
