import * as fsSync from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import { Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { Readable } from "stream";

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
    async getFile(
        @Param("type") fileType: string,
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        try {
            return await this.openFile(fileType, id, res);
        } catch (_) {
            if (fileType === "user") {
                return await this.openFile(fileType, "_default", res);
            }

            res.status(HttpStatus.NOT_FOUND);
            res.send();
        }
    }

    @Post(":type/:id")
    @UseGuards(AuthGuard)
    async sendFile(
        @Param("type") fileType: string,
        @Param("id") id: string,
        @Req() req: Request,
    ) {
        await fs.writeFile(
            path.join(process.cwd(), "static", fileType, id.toString() + ".jpg"),
            req.body,
        );
    }

    private async openFile(fileType: string, id: string, res: Response) {
        const file = await fs.readFile(
            path.join(process.cwd(), "static", fileType, id.toString() + ".jpg")
        );

        res.contentType("jpg");

        Readable.from(file).pipe(res);
    }
}