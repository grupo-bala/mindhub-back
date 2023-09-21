import { describe, it, expect, beforeEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { UserError, UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { GenericError } from "src/util/error";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

type Mock = Partial<Repository<User>>;

describe("UserService", () => {
    let service: UserService;
    let mockRepository: Mock = {};

    beforeEach(async () => {
        mockRepository = {};
        
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                }
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it("should save non existing user", () => {
        const user = new CreateUserDto();

        mockRepository.findOneBy = async () => null;
        mockRepository.save = async () => [];

        expect(() => service.create(user))
            .not.toThrow();
    });

    it("should throw with duplicated email", () => {
        const user = new CreateUserDto();

        mockRepository.findOneBy = async () => new User();

        expect(service.create(user))
            .rejects
            .toThrow(new GenericError<UserError>("DUPLICATE_EMAIL"));
    });

    it("should throw with duplicated username", () => {
        const user = new CreateUserDto();
        user.username = "teste";

        mockRepository.findOneBy = async (dto: CreateUserDto) => {
            if (dto.username) return new User();
            return null;
        };

        expect(service.create(user))
            .rejects
            .toThrow(new GenericError<UserError>("DUPLICATE_USERNAME"));
    });

    it("should return all users", () => {
        mockRepository.find = async () => {
            return [new User(), new User(), new User()];
        };

        expect(service.findAll())
            .resolves
            .toHaveLength(3);
    });

    it("should return the correct user by id", () => {
        const user = new User();
        user.id = 1;
        
        mockRepository.findOneBy = async () => {
            return user;
        };

        expect(service.findOne(1))
            .resolves
            .toBe(user);
    });

    it("should return null for non existent user id", () => {
        mockRepository.findOneBy = async () => {
            return null;
        };

        expect(service.findOne(1))
            .resolves
            .toBe(null);
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

        expect(service.update(1, user))
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

        expect(service.update(1, user))
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

        expect(service.remove(1))
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

        expect(service.remove(1))
            .resolves
            .toBeFalsy();
    });
});
