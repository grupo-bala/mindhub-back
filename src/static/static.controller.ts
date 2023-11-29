import * as fs from "fs";
import * as path from "path";
import { Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("static")
export class StaticController {
    constructor() {
        const staticPath = path.join(process.cwd(), "static");

        if (!fs.existsSync(staticPath)) {
            fs.mkdirSync(staticPath);
        }

        const types = ["material", "event", "ask", "user"];

        for (const fileType of types) {
            const typePath = path.join(staticPath, fileType);

            if (!fs.existsSync(typePath)) {
                fs.mkdirSync(typePath);
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
        const file = fs.createReadStream(
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
        const file = fs.createWriteStream(
            path.join(process.cwd(), "static", fileType, id.toString())
        );

        file.write(req.body);
    }
}