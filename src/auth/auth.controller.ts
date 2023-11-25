import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { AuthException, AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import { ApiTags } from "@nestjs/swagger";
import { instanceToPlain } from "class-transformer";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post("login")
    async login(
        @Body() { email, password }: LoginDTO
    ) {
        try {
            return instanceToPlain(await this.authService.signIn(email, password));
        } catch (e) {
            if (e instanceof AuthException) {
                throw new HttpException(e.name, HttpStatus.UNAUTHORIZED);
            }

            throw e;
        }
    }
}