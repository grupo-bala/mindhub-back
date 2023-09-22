import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Expertise } from "./entities/expertise.entity";
import { InjectRepository } from "@nestjs/typeorm";

export type ExpertiseError = 
    | "EXPERTISE DOESNT EXIST";

export class ExpertiseException extends Error {
    name: ExpertiseError;

    constructor(name: ExpertiseError) {
        super();
        this.name = name;
    }
}

@Injectable()
export class ExpertiseService {
    constructor(
        @InjectRepository(Expertise)
        private expertiseRepository: Repository<Expertise>,
    ) { }

    async findAll() {
        return this.expertiseRepository.find();
    }

    async findOne(title: string) {
        const expertise = await this.expertiseRepository.findOneBy({ title });

        if (expertise) {
            return expertise;
        }

        throw new ExpertiseException("EXPERTISE DOESNT EXIST");
    }
}
