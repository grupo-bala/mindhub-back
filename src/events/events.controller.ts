import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { EventException, EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { ApiTags } from "@nestjs/swagger";
import { instanceToPlain } from "class-transformer";
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags("events")
@Controller("events")
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() createEventDto: CreateEventDto) {
        try {
            await this.eventsService.create(createEventDto);
        } catch (e) {
            if (e instanceof EventException) {
                throw new HttpException(e.name, HttpStatus.BAD_REQUEST);
            }

            throw e;
        }
    }

    @Get()
    async findAll() {
        return {
            events: instanceToPlain(await this.eventsService.findAll()),
        };
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        try {
            return {
                event: instanceToPlain(await this.eventsService.findOne(+id)),
            };
        } catch (e) {
            if (e instanceof EventException && e.name === "EVENT DOESNT EXIST") {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @Get(":title")
    async find(@Param("title") title: string) {
        return {
            events: instanceToPlain(await this.eventsService.find(title)),
        };
    }

    @Patch(":id")
    @UseGuards(AuthGuard)
    update(
        @Param("id") id: string,
        @Body() updateEventDto: UpdateEventDto,
    ) {
        return this.eventsService.update(+id, updateEventDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    remove(@Param("id") id: string) {
        return this.eventsService.remove(+id);
    }
}
