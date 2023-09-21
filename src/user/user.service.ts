import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { GenericError } from "src/util/error";
import { AuthService } from "src/auth/auth.service";

export type UserError =
    | "DUPLICATE EMAIL"
    | "DUPLICATE USERNAME"
    | "USER DOESNT EXIST";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
    ) { }

    async create({ username, password, email }: CreateUserDto) {
        if (await this.userRepository.findOneBy({ email: email })) {
            throw new GenericError<UserError>("DUPLICATE EMAIL");
        } else if (await this.userRepository.findOneBy({ username: username })) {
            throw new GenericError<UserError>("DUPLICATE USERNAME");
        }

        const { hash, jwt } = await this.authService.signUp(username, password);

        await this.userRepository.save({
            username,
            email,
            hashPassword: hash,
        });

        return jwt;
    }

    async findAll() {
        return this.userRepository.find();
    }

    async findOne(username: string) {
        const user = await this.userRepository.findOneBy({ username });
        if (user) {
            return user;
        } else {
            throw new GenericError<UserError>("USER DOESNT EXIST");
        }
    }

    async update(username: string, updateUserDto: UpdateUserDto) {
        return (await this.userRepository.update(username, updateUserDto))!.affected! > 0;
    }

    async remove(username: number) {
        return (await this.userRepository.delete(username))!.affected! > 0;
    }
}