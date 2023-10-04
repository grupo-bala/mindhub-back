import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from "@nestjs/common";
import { MaterialException, MaterialService } from "./material.service";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { ExpertiseException } from "src/expertise/expertise.service";

@Controller("material")
export class MaterialController {
    constructor(private readonly materialService: MaterialService) {}

    @Post()
    async create(@Body() createMaterialDto: CreateMaterialDto) {
        try {
            return await this.materialService.create(createMaterialDto);
        } catch (e) {
            if (e instanceof MaterialException) {
                throw new HttpException(e.name, HttpStatus.BAD_REQUEST);
            } else if (e instanceof ExpertiseException) {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @Get()
    async findAll() {
        return await this.materialService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        try {
            return await this.materialService.findOne(+id);
        } catch (e) {
            if (e instanceof MaterialException && e.name === "MATERIAL DOESNT EXIST") {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @Get(":title")
    async find(@Param("title") title: string) {
        try {
            return await this.materialService.find(title);
        } catch (e) {
            if (e instanceof MaterialException && e.name === "MATERIAL DOESNT EXIST") {
                throw new HttpException("MATERIAL DOESNT EXIST", HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @Patch(":id")
    async update(@Param("id") id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
        await this.materialService.update(+id, updateMaterialDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        await this.materialService.remove(+id);
    }
}
