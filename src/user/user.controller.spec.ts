import { describe, it, expect, beforeEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService, UserException } from "./user.service";
import { AuthService } from "src/auth/auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ExpertiseException } from "src/expertise/expertise.service";

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

        mockService.create = async () => ({ token: "jwt" });
        
        expect(controller.create(dto))
            .resolves
            .toSatisfy((user: { token: string }) => user.token === "jwt");
    });

    it("should return status conflict with user error", () => {
        const dto = new CreateUserDto();

        mockService.create = async () => {
            throw new UserException("DUPLICATE EMAIL");
        };
        
        expect(controller.create(dto))
            .rejects
            .toThrow(new HttpException("DUPLICATE EMAIL", HttpStatus.CONFLICT));
    });

    it("should return status not found with expertise error", () => {
        const dto = new CreateUserDto();

        mockService.create = async () => {
            throw new ExpertiseException("EXPERTISE DOESNT EXIST");
        };
        
        expect(controller.create(dto))
            .rejects
            .toThrow(new HttpException("EXPERTISE DOESNT EXIST", HttpStatus.NOT_FOUND));
    });

    it("should rethrows with unknown error", () => {
        const dto = new CreateUserDto();

        mockService.create = async () => {
            throw new Error("unknown");
        };
        
        expect(controller.create(dto))
            .rejects
            .toThrow("unknown");
    });

    it("should return all users without password on get all", () => {
        const user = new User();

        mockService.findAll = async () => [user];

        expect(controller.findAll())
            .resolves
            .toSatisfy(({ users }: { users: User[] }) => {
                return users.every(user => !("hashPassword" in user));
            });
    });

    it("should return the correct user on get", () => {
        const user = new User();
        user.username = "teste";

        mockService.findOne = async () => user;

        expect(controller.findOne("teste"))
            .resolves
            .toSatisfy(
                ({ user: returnedUser }: { user: User }) => returnedUser.username === user.username
            );
    });

    it("should return status not found with non existent user error", () => {
        mockService.findOne = async () => {
            throw new UserException("USER DOESNT EXIST");
        };
        
        expect(controller.findOne("teste"))
            .rejects
            .toThrow(new HttpException("USER DOESNT EXIST", HttpStatus.NOT_FOUND));
    });

    it("should rethrows with unknown error", () => {
        mockService.findOne = async () => {
            throw new Error("unknown");
        };
        
        expect(controller.findOne("teste"))
            .rejects
            .toThrow("unknown");
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
