import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request as ExpressRequest } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get("JWT_SECRET"),
            });

            request.user = payload;
        } catch (e) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: ExpressRequest): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}

export type Request = ExpressRequest & { user: { sub: string } };