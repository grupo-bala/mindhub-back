import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { MaterialException, MaterialService } from "./material.service";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { ExpertiseException } from "src/expertise/expertise.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { instanceToPlain } from "class-transformer";
import { AuthGuard, Request } from "src/auth/auth.guard";

@ApiTags("material")
@ApiBearerAuth()
@Controller("material")
export class MaterialController {
    constructor(private readonly materialService: MaterialService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() createMaterialDto: CreateMaterialDto,
        @Req() req: Request,
    ) {
        try {
            return instanceToPlain(await this.materialService.create(createMaterialDto, req.user.sub));
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
    @UseGuards(AuthGuard)
    async findAll(@Req() req: Request) {
        return instanceToPlain(await this.materialService.findAll(req.user.sub));
    }

    @Get("id/:id")
    @UseGuards(AuthGuard)
    async findOne(
        @Param("id") id: string,
        @Req() req: Request,
    ) {
        try {
            return instanceToPlain(await this.materialService.findOne(+id, req.user.sub));
        } catch (e) {
            if (e instanceof MaterialException && e.name === "MATERIAL DOESNT EXIST") {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @Get("user/:username")
    @UseGuards(AuthGuard)
    async find(
        @Param("username") username: string,
        @Req() req: Request,
    ) {
        return instanceToPlain(await this.materialService.find(username, req.user.sub));
    }

    @Get("for-you")
    @UseGuards(AuthGuard)
    async forYou(@Req() req: Request) {
        return instanceToPlain(await this.materialService.getForYou(req.user.sub));
    }

    @Get("recents")
    @UseGuards(AuthGuard)
    async getRecents(@Req() req: Request) {
        return instanceToPlain(await this.materialService.getRecents(req.user.sub));
    }

    @Patch(":id")
    @UseGuards(AuthGuard)
    async update(
        @Param("id") id: string,
        @Body() updateMaterialDto: UpdateMaterialDto,
        @Req() req: Request,
    ) {
        await this.materialService.update(+id, req.user.sub, updateMaterialDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async remove(
        @Param("id") id: string,
        @Req() req: Request,
    ) {
        await this.materialService.remove(+id, req.user.sub);
    }
}
