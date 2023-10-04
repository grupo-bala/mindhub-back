import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UserService, UserException } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { instanceToPlain } from "class-transformer";

type AuthError =
    | "WRONG CREDENTIALS";

export class AuthException extends Error {
    name: AuthError;

    constructor(name: AuthError) {
        super();
        this.name = name;
    }
}

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async signIn(username: string, password: string) {
        try {
            const user = await this.userService.findOne(username);
            
            if (!await bcrypt.compare(password, user.hashPassword)) {
                throw new AuthException("WRONG CREDENTIALS");
            }
            
            const payload = { sub: user.username };

            return {
                token: await this.jwtService.signAsync(payload, {
                    secret: this.configService.get("JWT_SECRET")
                }),
                ...instanceToPlain(user)
            };
        } catch (e) {
            if (e instanceof UserException) {
                throw new AuthException("WRONG CREDENTIALS");
            }

            throw e;
        }
    }

    async signUp(username: string, password: string) {
        const hash = await bcrypt.hash(password, 10);
        const payload = { sub: username };

        return {
            hash,
            jwt: await this.jwtService.signAsync(payload, {
                secret: this.configService.get("JWT_SECRET"),
            }),
        };
    }
}