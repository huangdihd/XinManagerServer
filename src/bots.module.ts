import {MiddlewareConsumer, Module, RequestMethod} from "@nestjs/common";
import {AuthorizationMiddleware} from "./authorization.middleware";
import {BotsService} from "./bots.service";
import {BotsController} from "./bots.controller";

@Module({
    imports: [],
    controllers: [
        BotsController,
    ],
    providers: [
        BotsService,
    ],
})
export class BotsModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthorizationMiddleware)
            .forRoutes({
                    path: "/bots",
                    method: RequestMethod.ALL
                },
                {
                    path: "/bots/:id",
                    method: RequestMethod.ALL
                }
            )
    }
}