import { Injectable } from "@nestjs/common";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Material } from "./entities/material.entity";
import { ExpertiseException } from "src/expertise/expertise.service";
import { Repository } from "typeorm";
import { Expertise } from "src/expertise/entities/expertise.entity";

type MaterialError = 
    | "MATERIAL DOESNT EXIST";

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

    async create(
        { title, content, expertise, postDate }: CreateMaterialDto,
        username: string,
    ) {        
        try {
            await this.materialRepository.save({
                user: { username },
                title,
                content,
                postDate,
                expertise: {
                    title: expertise,
                    users: [],
                },
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

    async update(id: number, username: string, updateMaterialDto: UpdateMaterialDto) {
        const expertiseEntity = new Expertise();
        expertiseEntity.title = updateMaterialDto.expertise ?? "";

        const parsedDto = {
            ...updateMaterialDto,
            expertise: expertiseEntity,
        };

        return (
            await this.materialRepository.update({ id, user: { username } }, parsedDto)
        )!.affected! > 0;
    }

    async remove(id: number, username: string) {
        return (
            await this.materialRepository.delete({ id, user: { username } })
        )!.affected! > 0;
    }
}
