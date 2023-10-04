import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "src/auth/auth.service";
import { Expertise } from "src/expertise/entities/expertise.entity";
import { ExpertiseException } from "src/expertise/expertise.service";

type UserError =
    | "DUPLICATE EMAIL"
    | "DUPLICATE USERNAME"
    | "USER DOESNT EXIST"
    | "USER NEED AT LEAST ONE EXPERTISE"
    | "USER CAN HAVE UNTIL 3 EXPERTISES";

export class UserException extends Error {
    name: UserError;

    constructor(name: UserError) {
        super();
        this.name = name;
    }
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
    ) { }

    async create({ username, password, email, expertises, name }: CreateUserDto) {
        if (await this.userRepository.findOneBy({ email: email })) {
            throw new UserException("DUPLICATE EMAIL");
        } else if (await this.userRepository.findOneBy({ username: username })) {
            throw new UserException("DUPLICATE USERNAME");
        } else if (expertises.length < 1) {
            throw new UserException("USER NEED AT LEAST ONE EXPERTISE");
        } else if (expertises. length > 3) {
            throw new UserException("USER CAN HAVE UNTIL 3 EXPERTISES");
        }

        const { hash, jwt } = await this.authService.signUp(username, password);

        try {
            await this.userRepository.save({
                name,
                username,
                email,
                hashPassword: hash,
                expertises: expertises.map(e => {
                    const expertise = new Expertise();
                    expertise.title = e;
                    return expertise;
                }),
            });
        } catch (e) {
            const error = e as Error;

            if (error.message.includes("expertise")) {
                throw new ExpertiseException("EXPERTISE DOESNT EXIST");
            }

            throw error;
        }

        return jwt;
    }

    async findAll() {
        return this.userRepository.find({
            relations: {
                expertises: true,
            }
        });
    }

    async findOne(username: string) {
        const user = await this.userRepository.findOne({
            where: {
                username
            },
            relations: {
                expertises: true,
            }
        });
        
        if (user) {
            return user;
        } else {
            throw new UserException("USER DOESNT EXIST");
        }
    }

    async update(username: string, updateUserDto: UpdateUserDto) {
        const parsedDto = {
            ...updateUserDto,
            expertises: updateUserDto.expertises?.map(e => {
                const expertise = new Expertise();
                expertise.title = e;
                return expertise;
            }),
        };

        return (await this.userRepository.update(username, parsedDto))!.affected! > 0;
    }

    async remove(username: string) {
        return (await this.userRepository.delete(username))!.affected! > 0;
    }
}