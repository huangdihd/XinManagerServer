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
