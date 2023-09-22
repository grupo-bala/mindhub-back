import { describe, it, expect, beforeEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthService } from "src/auth/auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";

describe("UserController", () => {
    let controller: UserController;
    let mockService: Partial<UserService> = {};
    let mockAuth: Partial<AuthService> = {};

    beforeEach(async () => {
        mockAuth = {};
        mockService = {};

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockService,
                },
                {
                    provide: AuthService,
                    useValue: mockAuth,
                }
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it("should return jwt on post", () => {
        const dto = new CreateUserDto();

        mockService.create = async () => "jwt";
        
        expect(controller.create(dto))
            .resolves
            .toBe("jwt");
    });

    it("should return all users without password on get all", () => {
        const user = new User();

        mockService.findAll = async () => [user];

        expect(controller.findAll())
            .resolves
            .not.toSatisfy((user: object) => "hashPassword" in user);
    });

    it("should return the correct user on get", () => {
        const user = new User();
        user.username = "teste";

        mockService.findOne = async () => user;

        expect(controller.findOne("teste"))
            .resolves
            .toSatisfy(({ username }: User) => username === user.username);
    });

    it("should not throws on patch", () => {
        mockService.update = async () => true;

        expect(controller.update("teste", new UpdateUserDto()))
            .resolves
            .not.toThrow();
    });

    it("should not throws on delete", () => {
        mockService.remove = async () => true;

        expect(controller.remove("teste"))
            .resolves
            .not.toThrow();
    });
});
