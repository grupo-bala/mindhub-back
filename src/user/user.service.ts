import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { LessThanOrEqual, Repository } from "typeorm";
import { AuthService } from "src/auth/auth.service";
import { Expertise } from "src/expertise/entities/expertise.entity";
import { ExpertiseException } from "src/expertise/expertise.service";
import { instanceToPlain } from "class-transformer";
import { Badge } from "src/badge/entities/badge.entity";
import * as bcrypt from "bcrypt";

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
        @InjectRepository(Badge)
        private badgeRepository: Repository<Badge>,
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
                currentBadge: {
                    id: 1,
                },
                badges: [ { id: 1 } ],
            } as User);

            const user = await this.findOneByUsername(username);

            return {
                token: jwt,
                user: instanceToPlain(user),
            };
        } catch (e) {
            const error = e as Error;

            if (error.message.includes("expertise")) {
                throw new ExpertiseException("EXPERTISE DOESNT EXIST");
            }

            throw error;
        }
    }

    async findAll() {
        return this.userRepository.find({
            relations: {
                expertises: true,
                badges: true,
                currentBadge: true,
            }
        });
    }

    async findOneByUsername(username: string) {
        return this.findOne({ username });
    }

    async findOneByEmail(email: string) {
        return this.findOne({ email });
    }

    async update(username: string, updateUserDto: UpdateUserDto) {
        if (await this.userRepository.countBy({ username }) === 0) {
            throw new UserException("USER DOESNT EXIST");
        }

        const user = (await this
            .userRepository
            .findOneBy({ username }))!;

        const parsedDto = {
            username: username,
            name: updateUserDto.name,
            email: updateUserDto.email,
            hashPassword: user.hashPassword,
            xp: user.xp,
            currentBadge: user.currentBadge,
            expertises: updateUserDto.expertises
        };

        if (updateUserDto.password !== "") {
            const hash = await bcrypt.hash(updateUserDto.password!, 10);

            parsedDto["hashPassword"] = hash;
        }

        await this.userRepository.save(parsedDto);

        return true;
    }

    async remove(username: string) {
        return (await this.userRepository.delete(username))!.affected! > 0;
    }

    async addXp(username: string, quantity: number) {
        const user = await this.findOneByUsername(username);
        const newXp = Math.max(0, user.xp + quantity);

        const badges = await this.badgeRepository.find({
            where: {
                xp: LessThanOrEqual(newXp),
            },
        });

        await this.userRepository.save({
            username,
            xp: newXp,
            badges,
        });
    }

    private async findOne(where: Partial<User>) {
        const user = await this.userRepository.findOne({
            where,
            relations: {
                expertises: true,
                currentBadge: true,
                badges: true,
            }
        });

        if (user) {
            return user;
        } else {
            throw new UserException("USER DOESNT EXIST");
        }
    }
}