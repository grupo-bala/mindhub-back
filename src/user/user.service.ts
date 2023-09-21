import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { GenericError } from "src/util/error";

export type UserError =
    | "DUPLICATE_EMAIL"
    | "DUPLICATE_USERNAME";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        if (await this.userRepository.findOneBy({ email: createUserDto.email })) {
            throw new GenericError<UserError>("DUPLICATE_EMAIL");
        } else if (await this.userRepository.findOneBy({ username: createUserDto.username })) {
            throw new GenericError<UserError>("DUPLICATE_USERNAME");
        }

        this.userRepository.save({
            hashPassword: createUserDto.password,
            xp: 0,
            currentBadge: 0,
            ...createUserDto
        });
    }

    async findAll() {
        return this.userRepository.find();
    }

    async findOne(id: number) {
        return this.userRepository.findOneBy({ id });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return (await this.userRepository.update(id, updateUserDto))!.affected! > 0;
    }

    async remove(id: number) {
        return (await this.userRepository.delete(id))!.affected! > 0;
    }
}