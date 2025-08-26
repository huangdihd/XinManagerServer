import {MiddlewareConsumer, Module, RequestMethod} from "@nestjs/common";
import {PerformanceController} from "./performance.controller";
import {AuthorizationMiddleware} from "./authorization.middleware";

@Module({
    imports: [],
    controllers: [
        PerformanceController,
    ],
    providers: [
        PerformanceController,
    ],
})
export class PerformanceModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthorizationMiddleware)
            .forRoutes({
                path: "/performance",
                method: RequestMethod.ALL,
            })
    }
}