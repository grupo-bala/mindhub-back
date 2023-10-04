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
        if (expertise.length < 1) {
            throw new MaterialException("MATERIAL NEED ONE EXPERTISE");
        } else if (expertise.length > 1) {
            throw new MaterialException("MATERIAL MAY HAVE ONLY 1 EXPERTISE");
        }
        
        try {
            await this.materialRepository.save({
                username,
                title,
                content,
                expertise: expertise.map(e => {
                    const expertise = new Expertise();
                    expertise.title = e;
                    return expertise;
                }),
            });
            console.log("aqui");
        } catch (error) {
            throw new ExpertiseException("EXPERTISE DOESNT EXIST");
        }
    }

    async findAll() {
        return this.materialRepository.find();
    }
    
    async find(title: string) {
        const material = await this.materialRepository.findBy({ title });

        if (material.length >= 1) {
            return material;
        } else {
            throw new MaterialException("MATERIAL DOESNT EXIST");
        }
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
        const parsedDto = {
            ...updateMaterialDto,
            expertise: updateMaterialDto.expertise?.map(e => {
                const expertise = new Expertise();
                expertise.title = e;
                return expertise;
            }),
        };

        return (await this.materialRepository.update(id, parsedDto))!.affected! > 0;
    }

    async remove(id: number) {
        return (await this.materialRepository.delete(id))!.affected! > 0;
    }
}
