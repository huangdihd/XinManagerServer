import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import {Throttle} from "@nestjs/throttler";
import '@fastify/cookie';
import {config} from "./main"

@Controller('login')
export class LoginController {
    constructor() {
    }

    @Throttle({default: {ttl: 60000, limit: 5}})
    @Post()
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
}
