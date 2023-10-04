import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common";
import { ExpertiseException, ExpertiseService } from "./expertise.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("expertise")
@Controller("expertise")
export class ExpertiseController {
    constructor(
        private readonly expertiseService: ExpertiseService
    ) { }

    @Get()
    async findAll() {
        return {
            expertises: await this.expertiseService.findAll(),
        };
    }

    @Get(":title")
    async findOne(@Param("title") title: string) {
        try {
            return {
                expertise: await this.expertiseService.findOne(title),
            };
        } catch (e) {
            if (e instanceof ExpertiseException) {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }
}
