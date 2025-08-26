import {MiddlewareConsumer, Module, RequestMethod} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {AuthorizationMiddleware} from "./authorization.middleware";

@Module({
    imports: [],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService
    ],
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthorizationMiddleware)
            .forRoutes(
                {
                    path: "/auth/check",
                    method: RequestMethod.ALL
                }
            )
    }
}