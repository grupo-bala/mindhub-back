import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UserError, UserService } from "src/user/user.service";
import bcrypt from "bcrypt";
import { GenericError } from "src/util/error";
import { JwtService } from "@nestjs/jwt";

export type AuthError =
    | "WRONG CREDENTIALS";

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn(username: string, password: string) {
        try {
            const user = await this.userService.findOne(username);
            
            if (!await bcrypt.compare(password, user.hashPassword)) {
                throw new GenericError<AuthError>("WRONG CREDENTIALS");
            }
            
            const payload = { sub: user.username };
            return await this.jwtService.signAsync(payload);
        } catch (e) {
            if (e instanceof GenericError && e.name satisfies UserError) {
                throw new GenericError<AuthError>("WRONG CREDENTIALS");
            }
        }
    }

    async signUp(username: string, password: string) {
        const hash = await bcrypt.hash(password, 10);
        const payload = { sub: username };

        return {
            hash,
            jwt: await this.jwtService.signAsync(payload),
        };
    }
}