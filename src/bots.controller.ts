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

import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Res} from "@nestjs/common";
import type {FastifyReply} from "fastify";
import {BotManager} from "./Bot";

@Controller('bots')
export class BotsController {
    @Get()
    async bots(@Res({passthrough: true}) response: FastifyReply) {
        response.status(HttpStatus.OK).send(Array.from(BotManager.getInstance().getBots()));
    }

    @Get(':id')
    bot(@Param('id') id: string, @Res({passthrough: true}) response: FastifyReply) {
        const idNum = Number(id);
        if (isNaN(idNum)) {
            response.status(HttpStatus.BAD_REQUEST).send({message: 'Bad request'});
            return;
        }
        const bot = BotManager.getInstance().getBot(idNum);
        if (bot === undefined) {
            response.status(HttpStatus.NOT_FOUND).send({message: 'Bot not found'});
            return;
        }
        response.status(HttpStatus.OK).send(bot);
    }

    @Post('create')
    async create(@Body() body: any, @Res({passthrough: true}) response: FastifyReply) {
        if (body.url === undefined || body.token === undefined) {
            response.status(HttpStatus.BAD_REQUEST).send({message: 'Bad request'});
            return;
        }
        if (!URL.parse(body.url)) {
            response.status(HttpStatus.BAD_REQUEST).send({message: 'Url is invalid'});
            return;
        }
        const bot = await BotManager.getInstance().addBot(body.url, body.token);
        response.status(HttpStatus.OK).send(bot);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res({passthrough: true}) response: FastifyReply) {
        const idNum = Number(id);
        if (isNaN(idNum)) {
            response.status(HttpStatus.BAD_REQUEST).send({message: 'Bad request'});
            return;
        }
        const bot = BotManager.getInstance().getBot(idNum);
        if (bot === undefined) {
            response.status(HttpStatus.NOT_FOUND).send({message: 'Bot not found'});
            return;
        }
        BotManager.getInstance().removeBot(idNum);
        response.status(HttpStatus.OK).send({message: 'Bot deleted'});
    }
}
