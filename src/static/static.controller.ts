import * as fsSync from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import { Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("static")
export class StaticController {
    constructor() {
        const staticPath = path.join(process.cwd(), "static");

        if (!fsSync.existsSync(staticPath)) {
            fsSync.mkdirSync(staticPath);
        }

        const types = ["material", "event", "ask", "user"];

        for (const fileType of types) {
            const typePath = path.join(staticPath, fileType);

            if (!fsSync.existsSync(typePath)) {
                fsSync.mkdirSync(typePath);
            }
        }
    }

    @Get(":type/:id")
    @UseGuards(AuthGuard)
    async getFile(
        @Param("type") fileType: string,
        @Param("id") id: number,
        @Res() res: Response,
    ) {
        const file = fsSync.createReadStream(
            path.join(process.cwd(), "static", fileType, id.toString())
        );

        file.pipe(res);
    }

    @Post(":type/:id")
    @UseGuards(AuthGuard)
    async sendFile(
        @Param("type") fileType: string,
        @Param("id") id: number,
        @Req() req: Request,
    ) {
        await fs.writeFile(
            path.join(process.cwd(), "static", fileType, id.toString()),
            req.body,
        );
    }
}