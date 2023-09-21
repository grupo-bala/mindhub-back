import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("user")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":username")
    async findOne(@Param("username") username: string) {
        return await this.userService.findOne(username);
    }

    @Patch(":username")
    async update(
        @Param("username") username: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        await this.userService.update(username, updateUserDto);
    }

    @Delete(":username")
    async remove(@Param("username") username: string) {
        await this.userService.remove(username);
    }
}
