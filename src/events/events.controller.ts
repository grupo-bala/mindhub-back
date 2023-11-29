import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards, Req } from "@nestjs/common";
import { EventException, EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { instanceToPlain } from "class-transformer";
import { AuthGuard, Request } from "src/auth/auth.guard";

@ApiTags("events")
@ApiBearerAuth()
@Controller("events")
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() createEventDto: CreateEventDto,
        @Req() req: Request,
    ) {
        try {
            return instanceToPlain(await this.eventsService.create(createEventDto, req.user.sub));
        } catch (e) {
            if (e instanceof EventException) {
                throw new HttpException(e.name, HttpStatus.BAD_REQUEST);
            }

            throw e;
        }
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(@Req() req: Request) {
        return instanceToPlain(await this.eventsService.findAll(req.user.sub));
    }

    @Get("id/:id")
    @UseGuards(AuthGuard)
    async findOne(
        @Param("id") id: string,
        @Req() req: Request,
    ) {
        try {
            return instanceToPlain(await this.eventsService.findOne(+id, req.user.sub));
        } catch (e) {
            if (e instanceof EventException && e.name === "EVENT DOESNT EXIST") {
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
        return instanceToPlain(await this.eventsService.find(username, req.user.sub));
    }

    @Get("recents")
    @UseGuards(AuthGuard)
    async getRecents(@Req() req: Request) {
        return instanceToPlain(await this.eventsService.getRecents(req.user.sub));
    }

    @Patch(":id")
    @UseGuards(AuthGuard)
    update(
        @Param("id") id: string,
        @Body() updateEventDto: UpdateEventDto,
        @Req() req: Request,
    ) {
        return this.eventsService.update(+id, req.user.sub, updateEventDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    remove(
        @Param("id") id: string,
        @Req() req: Request,    
    ) {
        return this.eventsService.remove(+id, req.user.sub);
    }
}
