import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import "reflect-metadata";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(bodyParser.raw({ limit: "10mb", type: "application/octet-stream" }));

    const config = new DocumentBuilder()
        .setTitle("Mindhub")
        .setDescription("The Mindhub API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    await app.listen(3000);
}

bootstrap();
