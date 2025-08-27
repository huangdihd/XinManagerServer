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

import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { config } from './main';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    use(req: FastifyRequest, res: ServerResponse, next: () => void) {
        const password = req.headers['cookie']?.match(/password=([^;]+)/)?.[1];

        const unauthorized = () => {
            res.statusCode = 401;
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.setHeader('Set-Cookie', 'password=; Path=/api; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
            res.end(JSON.stringify({ message: 'Unauthorized' }));
        };

        if (password !== config?.password) return unauthorized();

        next()
    }
}
