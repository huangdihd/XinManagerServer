import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from "node:fs";
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Config } from "./config";
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

export let config: Config | null = null

if (fs.existsSync("config.json")) {
    config = JSON.parse(fs.readFileSync("config.json", "utf-8")) as Config;
}
if (config == null) {
    console.log("config.json is empty");
    console.log("try to create config.json");
    config = {
        password: randomStringGenerator(),
        cookie_secret: randomStringGenerator(),
    }
    fs.writeFileSync("config.json", JSON.stringify(config));
}

console.log("password: " + config.password);

BotManager.getInstance().loadFromDB().then(() => {
    console.log("bots loaded from db");
    updateBots().then(r => console.log("bots updated"))
})

updateServerInfo().then(r => console.log("server info updated"))

bootstrap().then(r => console.log('Server started'));
