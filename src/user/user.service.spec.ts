import { describe, it, expect, beforeEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { UserException, UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthService } from "src/auth/auth.service";

describe("UserService", () => {
    let service: UserService;
    let mockRepository: Partial<Repository<User>> = {};
    let mockAuth: Partial<AuthService> = {};

    beforeEach(async () => {
        mockRepository = {};
        mockAuth = {};
        
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<UserService>(UserService);
    });

    it("should save non existing user", () => {
        const user = new CreateUserDto();
        user.expertises = [""];

        mockRepository.findOneBy = async () => null;
        mockRepository.save = async () => [];
        mockAuth.signUp = async () => ({ hash: "", jwt: "" });

        expect(() => service.create(user))
            .not.toThrow();
    });

    it("should throw with duplicated email", () => {
        const user = new CreateUserDto();

        mockRepository.findOneBy = async () => new User();

        expect(service.create(user))
            .rejects
            .toThrow(new UserException("DUPLICATE EMAIL"));
    });

    it("should throw with duplicated username", () => {
        const user = new CreateUserDto();
        user.username = "teste";

        mockRepository.findOneBy = async (dto: object) => {
            if ("username" in dto) return new User();
            return null;
        };

        expect(service.create(user))
            .rejects
            .toThrow(new UserException("DUPLICATE USERNAME"));
    });

    it("should throw with no expertise", () => {
        const user = new CreateUserDto();
        user.username = "teste";
        user.expertises = [];

        mockRepository.findOneBy = async () => null;

        expect(service.create(user))
            .rejects
            .toThrow(new UserException("USER NEED AT LEAST ONE EXPERTISE"));
    });

    it("should throw with 4 expertisew", () => {
        const user = new CreateUserDto();
        user.username = "teste";
        user.expertises = ["", "", "", ""];

        mockRepository.findOneBy = async () => null;

        expect(service.create(user))
            .rejects
            .toThrow(new UserException("USER CAN HAVE UNTIL 3 EXPERTISES"));
    });

    it("should return all users", () => {
        mockRepository.find = async () => {
            return [new User(), new User(), new User()];
        };

        expect(service.findAll())
            .resolves
            .toHaveLength(3);
    });

    it("should return the correct user by username", () => {
        const user = new User();
        user.username = "teste";
        
        mockRepository.findOneBy = async () => {
            return user;
        };

        expect(service.findOne("teste"))
            .resolves
            .toBe(user);
    });

    it("should return null for non existent username", () => {
        mockRepository.findOneBy = async () => {
            return null;
        };

        expect(service.findOne("teste"))
            .rejects
            .toThrow(new UserException("USER DOESNT EXIST"));
    });

    it("should return true when updating 1 user", () => {
        const user = new UpdateUserDto();

        mockRepository.update = async () => {
            return {
                affected: 1,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.update("teste", user))
            .resolves
            .toBeTruthy();
    });

    it("should return false when updating no user", () => {
        const user = new UpdateUserDto();

        mockRepository.update = async () => {
            return {
                affected: 0,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.update("teste", user))
            .resolves
            .toBeFalsy();
    });

    it("should return true when deleting 1 user", () => {
        mockRepository.delete = async () => {
            return {
                affected: 1,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.remove("teste"))
            .resolves
            .toBeTruthy();
    });

    it("should return false when deleting no user", () => {
        mockRepository.delete = async () => {
            return {
                affected: 0,
                generatedMaps: [],
                raw: {},
            };
        };

        expect(service.remove("teste"))
            .resolves
            .toBeFalsy();
    });
});
