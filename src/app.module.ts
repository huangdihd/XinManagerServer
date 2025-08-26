import { Module } from '@nestjs/common';
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {AuthModule} from "./auth.module";
import {BotsModule} from "./bots.module";
import {BbttModule} from "./bbtt.module";
import {PerformanceModule} from "./performance.module";

@Module({
  imports: [
      ThrottlerModule.forRoot({
          throttlers: [
              {
                  ttl: 60,
                  limit: 100,
              }
          ]
      }),
      AuthModule,
      BotsModule,
      BbttModule,
      PerformanceModule,
  ],
  providers: [
      {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
      }
  ],
})
export class AppModule {}
