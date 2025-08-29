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

import {Body, Controller, Get, Patch, Res} from "@nestjs/common";
import {config} from "./main";
import {saveConfig} from "./config";
import type {FastifyReply} from "fastify";

@Controller('config')
export class ConfigController {
    @Patch('bbtt_fetch_interval')
    async updateBbttFetchInterval(@Body() body: any, @Res({passthrough: true}) response: FastifyReply) {
        if (body.value === undefined) {
            response.status(400).send({message: 'Bad request'});
            return;
        }
        const value = Number(body.value);
        if (isNaN(value)) {
            response.status(400).send({message: 'Bad request'});
            return;
        }
        config.bbtt_fetch_interval = value;
        saveConfig();
        response.status(200).send({message: 'Success'});
    }

    @Patch('bots_fetch_interval')
    async updateBotsFetchInterval(@Body() body: any, @Res({passthrough: true}) response: FastifyReply) {
        if (body.value === undefined) {
            response.status(400).send({message: 'Bad request'});
            return;
        }
        const value = Number(body.value);
        if (isNaN(value)) {
            response.status(400).send({message: 'Bad request'});
            return;
        }
        config.bots_fetch_interval = value;
        saveConfig();
        response.status(200).send({message: 'Success'});
    }

    @Get('reset')
    async resetConfig(@Res({passthrough: true}) response: FastifyReply) {
        config.bots_fetch_interval = 10000;
        config.bbtt_fetch_interval = 10000;
        saveConfig();
        response.status(200).send({message: 'Success'});
    }

    @Get()
    getConfig() {
        return {
            bots_fetch_interval: config.bots_fetch_interval,
            bbtt_fetch_interval: config.bbtt_fetch_interval,
        };
    }
}
