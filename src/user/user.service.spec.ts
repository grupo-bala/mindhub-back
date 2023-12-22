import { describe, it, expect, beforeEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { UserException, UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthService } from "src/auth/auth.service";
import { ExpertiseException } from "src/expertise/expertise.service";
import { Badge } from "src/badge/entities/badge.entity";

describe("UserService", () => {
    let service: UserService;
    let mockRepository: Partial<Repository<User>> = {};
    let mockAuth: Partial<AuthService> = {};
    const badgesMock: Partial<Repository<Badge>> = {};

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
                    provide: getRepositoryToken(Badge),
                    useValue: badgesMock,
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
        mockRepository.findOne = async () => new User();
        mockRepository.save = async () => [];
        mockAuth.signUp = async () => ({ hash: "", jwt: "" });

        expect(() => service.create(user))
            .not.toThrow();
    });

    it("should throw with duplicated email", () => {
        const user = new CreateUserDto();

        mockRepository.findOneBy = async () => new User();
        mockRepository.findOne = async () => new User();

        expect(service.create(user))
            .rejects
            .toThrow(new UserException("DUPLICATE EMAIL"));
    });

    it("should throw with duplicated username", () => {
        const user = new CreateUserDto();
        user.username = "teste";

        mockRepository.findOne = async () => new User();
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

        mockRepository.findOne = async () => new User();
        mockRepository.findOneBy = async () => null;

        expect(service.create(user))
            .rejects
            .toThrow(new UserException("USER NEED AT LEAST ONE EXPERTISE"));
    });

    it("should throw with 4 expertisew", () => {
        const user = new CreateUserDto();
        user.username = "teste";
        user.expertises = ["", "", "", ""];

        mockRepository.findOne = async () => new User();
        mockRepository.findOneBy = async () => null;

        expect(service.create(user))
            .rejects
            .toThrow(new UserException("USER CAN HAVE UNTIL 3 EXPERTISES"));
    });

    it("should throw with non existent expertise", () => {
        const user = new CreateUserDto();
        user.expertises = [""];

        mockAuth.signUp = async () => ({ hash: "", jwt: "" });
        mockRepository.findOneBy = async () => null;
        mockRepository.findOne = async () => new User();
        mockRepository.save = async () => {
            throw new Error();
        };

        expect(service.create(user))
            .rejects
            .toThrow(new ExpertiseException("EXPERTISE DOESNT EXIST"));
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
        
        mockRepository.findOne = async () => {
            return user;
        };

        badgesMock.find = async () => [];

        expect(service.findOneByUsername("teste"))
            .resolves
            .toSatisfy((returnedUser: User) => returnedUser.username == user.username);
    });

    it("should return null for non existent username", () => {
        mockRepository.findOne = async () => {
            return null;
        };

        badgesMock.find = async () => [];

        expect(service.findOneByUsername("teste"))
            .rejects
            .toThrow(new UserException("USER DOESNT EXIST"));
    });

    it("should return true when updating 1 user", () => {
        const user = new UpdateUserDto();

        user.password = "";

        mockRepository.countBy = async () => {
            return 1;
        };

        mockRepository.findOneBy = async () => {
            return new User();
        };

        mockRepository.save = async () => {
            return [];
        };

        expect(service.update("teste", user))
            .resolves
            .toBe(true);
    });

    it("should throws when updating no user", () => {
        const user = new UpdateUserDto();

        mockRepository.countBy = async () => {
            return 0;
        };

        expect(service.update("teste", user))
            .rejects.toThrow(new UserException("USER DOESNT EXIST"));
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
