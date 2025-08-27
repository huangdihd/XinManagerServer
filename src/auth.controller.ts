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

import {Body, Controller, Get, HttpStatus, Patch, Post, Res} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import {Throttle} from "@nestjs/throttler";
import '@fastify/cookie';
import {config} from "./main"
import {saveConfig} from "./config";

@Controller('auth')
export class AuthController {
    constructor() {
    }

    @Get('check')
    check() {}

    @Throttle({default: {ttl: 60000, limit: 5}})
    @Post('login')
    login(@Body() body: any, @Res({passthrough: true}) response: FastifyReply) {
        if (body.password === undefined) {
            response
                .status(HttpStatus.UNAUTHORIZED)
                .send({
                    message: "Wrong password",
                })
            return;
        }
        if (body.password !== config?.password) {
            response
                .status(HttpStatus.UNAUTHORIZED)
                .send({
                    message: "Wrong password",
                });
            return;
        }
        response.setCookie('password', body.password, {
            httpOnly: true,
            path: '/api',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60,
        })
        response
            .status(HttpStatus.OK)
            .send({
                message: "Logged in",
            });
    }

    @Post('logout')
    logout(@Res({passthrough: true}) response: FastifyReply) {
        response.clearCookie('password', {
            httpOnly: true,
            path: '/api',
            sameSite: 'strict',
        })
            .status(HttpStatus.OK)
            .send({
                message: "Logged out",
            });
    }
    @Patch('change_password')
    changePassword(@Body() body: any, @Res({passthrough: true}) response: FastifyReply) {
        const password = body.password;
        if (password === undefined) {
            response
                .status(HttpStatus.BAD_REQUEST)
                .send({
                    message: "Password is required",
                })
            return;
        }
        if (password.length < 8) {
            response
                .status(HttpStatus.BAD_REQUEST)
                .send({
                    message: "Password must be at least 8 characters long",
                })
            return;
        }
        if (password === config?.password) {
            response
                .status(HttpStatus.BAD_REQUEST)
                .send({
                    message: "New password must be different from the current password",
                })
            return;
        }
        config.password = password;
        saveConfig();
        response
            .status(HttpStatus.OK)
            .send({
                message: "Password changed",
            })
    }
}
