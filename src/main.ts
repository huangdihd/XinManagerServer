/*
 *   Copyright (C) 2025 huangdihd
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from "node:fs";
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import {Config, loadConfig} from "./config";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import fastifyCookie from "@fastify/cookie";
import * as console from "node:console";
import {BotManager, updateBots} from "./Bot";
import { updateServerInfo } from "./bbtt";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ trustProxy: true }));
    // @ts-ignore
    await app.register(fastifyCookie, {
        secret: config?.cookie_secret
    });
    app.enableCors({
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3001);
}

export const config = loadConfig();

BotManager.getInstance().loadFromDB().then(() => {
    console.log("bots loaded from db");
    updateBots().then(r => console.log("bots updated"))
})

updateServerInfo().then(r => console.log("server info updated"))

bootstrap().then(r => console.log('Server started'));
