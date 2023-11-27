import { Injectable } from "@nestjs/common";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Material } from "./entities/material.entity";
import { ExpertiseException } from "src/expertise/expertise.service";
import { Repository } from "typeorm";
import { Expertise } from "src/expertise/entities/expertise.entity";

type MaterialError = 
    | "MATERIAL DOESNT EXIST"
    | "MATERIAL NEED ONE EXPERTISE"
    | "MATERIAL MAY HAVE ONLY 1 EXPERTISE";

export class MaterialException extends Error {
    name: MaterialError;

    constructor(name: MaterialError) {
        super();
        this.name = name;
    }
}

@Injectable()
export class MaterialService {
    constructor(
        @InjectRepository(Material)
        private materialRepository: Repository<Material>
    ) { }

    async create({ username, title, content, expertise }: CreateMaterialDto) {
        const expertiseEntity = new Expertise();
        expertiseEntity.title = expertise;
        
        try {
            await this.materialRepository.save({
                username,
                title,
                content,
                expertise: expertiseEntity,
            });
        } catch (error) {
            throw new ExpertiseException("EXPERTISE DOESNT EXIST");
        }
    }

    async findAll() {
        return this.materialRepository.find();
    }
    
    async find(username: string) {
        return await this.materialRepository.find({
            where: {
                user: {
                    username
                }
            }
        });
    }
    
    async findOne(id: number) {
        const material = await this.materialRepository.findOneBy({ id });

        if (material) {
            return material;
        } else {
            throw new MaterialException("MATERIAL DOESNT EXIST");
        }
    }

    async update(id: number, updateMaterialDto: UpdateMaterialDto) {
        const expertiseEntity = new Expertise();
        expertiseEntity.title = updateMaterialDto.expertise ?? "";

        const parsedDto = {
            ...updateMaterialDto,
            expertise: expertiseEntity,
        };

        return (await this.materialRepository.update(id, parsedDto))!.affected! > 0;
    }

    async remove(id: number) {
        return (await this.materialRepository.delete(id))!.affected! > 0;
    }
}
