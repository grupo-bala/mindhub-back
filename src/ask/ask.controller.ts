import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus } from "@nestjs/common";
import { AskException, AskService } from "./ask.service";
import { CreateAskDto } from "./dto/create-ask.dto";
import { UpdateAskDto } from "./dto/update-ask.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard, Request } from "src/auth/auth.guard";
import { instanceToPlain } from "class-transformer";
import { ExpertiseException } from "src/expertise/expertise.service";

@ApiTags("ask")
@ApiBearerAuth()
@Controller("ask")
export class AskController {
    constructor(private readonly askService: AskService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() createAskDto: CreateAskDto,
        @Req() req: Request,
    ) {
        try {
            return instanceToPlain(await this.askService.create(createAskDto, req.user.sub));
        } catch (error) {
            if (error instanceof AskException) {
                throw new HttpException(error.name, HttpStatus.BAD_REQUEST);
            } else if (error instanceof ExpertiseException) {
                throw new HttpException(error.name, HttpStatus.NOT_FOUND);
            }

            throw error;
        }
    }

    @Get(":pattern")
    @UseGuards(AuthGuard)
    async find(
        @Param("pattern") pattern: string,
        @Req() req: Request
    ) {
        return instanceToPlain(await this.askService.find(req.user.sub, pattern));
    }

    @Get("user/:username")
    @UseGuards(AuthGuard)
    async findByUser(
        @Param("username") username: string,
        @Req() req: Request,
    ) {
        return instanceToPlain(await this.askService.findByUser(username, req.user.sub));
    }

    @Get("id/:id")
    @UseGuards(AuthGuard)
    async findOne(
        @Param("id") id: string,
        @Req() req: Request,
    ) {
        try {
            return instanceToPlain(await this.askService.findOne(+id, req.user.sub));
        } catch (error) {
            if (error instanceof AskException && error.name === "ASK DOESNT EXIST") {
                throw new HttpException(error.name, HttpStatus.NOT_FOUND);
            }

            throw error;
        }
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(@Req() req: Request) {
        return instanceToPlain(await this.askService.findAll(req.user.sub));
    }


    @Get("recents")
    @UseGuards(AuthGuard)
    async getRecents(@Req() req: Request) {
        return instanceToPlain(await this.askService.getRecents(req.user.sub));
    }

    @Patch(":id")
    @UseGuards(AuthGuard)
    async update(
        @Param("id") id: string, 
        @Body() updateAskDto: UpdateAskDto,
        @Req() req: Request,
    ) {
        await this.askService.update(+id, req.user.sub, updateAskDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async remove(
        @Param("id") id: string,
        @Req() req: Request,
    ) {
        await this.askService.remove(+id, req.user.sub);
    }
}
