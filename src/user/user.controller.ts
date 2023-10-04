import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { UserService, UserException } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ExpertiseException } from "src/expertise/expertise.service";
import { instanceToPlain } from "class-transformer";
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags("user")
@ApiBearerAuth()
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.userService.create(createUserDto);
        } catch (e) {
            if (e instanceof UserException) {
                throw new HttpException(e.name, HttpStatus.CONFLICT);
            } else if (e instanceof ExpertiseException) {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async findAll() {
        return {
            users: instanceToPlain(await this.userService.findAll()),
        };
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":username")
    async findOne(@Param("username") username: string) {
        try {
            return {
                user: instanceToPlain(await this.userService.findOne(username)),
            };
        } catch (e) {
            if (e instanceof UserException && e.name === "USER DOESNT EXIST") {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @Patch(":username")
    @UseGuards(AuthGuard)
    async update(
        @Param("username") username: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        await this.userService.update(username, updateUserDto);
    }

    @Delete(":username")
    @UseGuards(AuthGuard)
    async remove(@Param("username") username: string) {
        await this.userService.remove(username);
    }
}
