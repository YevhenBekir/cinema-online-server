import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {getDatabaseConfig} from "./config/db.config"

import {ConfigService} from "@nestjs/config";
import {TypegooseModuleOptions} from "nestjs-typegoose";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    await app.listen(3000);
}

bootstrap();