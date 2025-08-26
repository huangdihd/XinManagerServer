import {MiddlewareConsumer, Module, RequestMethod} from "@nestjs/common";
import {AuthorizationMiddleware} from "./authorization.middleware";
import {BbttController} from "./bbtt.controller";

@Module({
    imports: [],
    controllers: [
        BbttController,
    ],
    providers: [
        BbttController,
    ],
})
export class BbttModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthorizationMiddleware)
            .forRoutes({
                    path: "/bbtt",
                    method: RequestMethod.ALL
                },
                {
                    path: "/bbtt/update",
                    method: RequestMethod.ALL
                }
            )
    }
}