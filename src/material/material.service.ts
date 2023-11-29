import { Injectable } from "@nestjs/common";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Material } from "./entities/material.entity";
import { ExpertiseException } from "src/expertise/expertise.service";
import { Repository } from "typeorm";
import { Expertise } from "src/expertise/entities/expertise.entity";
import { ScoreService } from "src/score/score.service";
import { User } from "src/user/entities/user.entity";

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
        private materialRepository: Repository<Material>,
        private scoreService: ScoreService,
    ) { }

    async create(
        { title, content, expertise, postDate }: CreateMaterialDto,
        username: string,
    ): Promise<Material> {        
        try {
            const { id } = await this.materialRepository.save({
                user: { username },
                title,
                content,
                postDate,
                expertise: {
                    title: expertise,
                    users: [],
                },
            });

            return this.findOne(id, username);
        } catch (error) {
            throw new ExpertiseException("EXPERTISE DOESNT EXIST");
        }
    }

    async findAll(username: string) {
        const materials = await this.materialRepository.find({
            relations: {
                expertise: true,
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                },
            }
        });

        return Promise.all(
            materials.map(async material => ({
                ...material,
                score: await this.scoreService.getPostScore(material.id),
                userScore: await this.scoreService.getUserScoreOnPost(material.id, username) ?? 0,
            }))
        );
    }
    
    async getRecents(username: string) {
        const materials = await this.materialRepository.find({
            relations: {
                expertise: true,
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                },
            },
            order: {
                postDate: "DESC"
            }
        });

        return Promise.all(
            materials.map(async material => ({
                ...material,
                score: await this.scoreService.getPostScore(material.id),
                userScore: await this.scoreService.getUserScoreOnPost(material.id, username) ?? 0
            }))
        );
    }

    async getForYou(username: string) {
        const materials = await this.materialRepository.createQueryBuilder("material")
            .select()
            .leftJoinAndSelect("material.expertise", "expertise")
            .leftJoinAndSelect("material.user", "user")
            .leftJoinAndSelect("user.currentBadge", "badge")
            .leftJoinAndSelect("user.badges", "badges")
            .leftJoinAndSelect("user.expertises", "expertises")
            .where(qb => {
                const subquery = qb.subQuery()
                    .select()
                    .from(User, "user")
                    .leftJoinAndSelect("user.expertises", "expertises")
                    .where("user.username = :username", { username })
                    .getQuery();
                return "material.expertise in " + subquery;
            })
            .getMany();
        
        return await Promise.all(
            materials.map(async material => ({
                ...material,
                score: await this.scoreService.getPostScore(material.id),
                userScore: await this.scoreService.getUserScoreOnPost(material.id, username) ?? 0
            }))
        );
    }

    async find(usernameTarget: string, usernameViewer: string) {
        const materials = await this.materialRepository.find({
            where: {
                user: {
                    username: usernameTarget,
                },
            },
            relations: {
                expertise: true,
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                },
            },
        });

        return Promise.all(
            materials.map(async material => ({
                ...material,
                score: await this.scoreService.getPostScore(material.id),
                userScore: await this.scoreService.getUserScoreOnPost(material.id, usernameViewer) ?? 0,
            }))
        );
    }
    
    async findOne(id: number, username: string) {
        const material = await this.materialRepository.findOne({
            where: {
                id
            },
            relations: {
                expertise: true,
                user: {
                    badges: true,
                    currentBadge: true,
                    expertises: true,
                },
            },
        });

        if (material) {
            return {
                ...material,
                score: await this.scoreService.getPostScore(id),
                userScore: await this.scoreService.getUserScoreOnPost(id, username) ?? 0,
            };
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
