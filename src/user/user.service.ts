import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    ) {}

    create(createUserDto: CreateUserDto) {
        this.userRepository.save({
            hashPassword: createUserDto.password,
            xp: 0,
            currentBadge: 0,
            ...createUserDto
        });
    }

    findAll() {
        return this.userRepository.find();
    }

    findOne(id: number) {
        return this.userRepository.findOneBy({ id });
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.userRepository.update(id, updateUserDto);
    }

    remove(id: number) {
        return this.userRepository.delete(id);
    }
}
