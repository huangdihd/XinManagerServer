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

import { Module } from '@nestjs/common';
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {AuthModule} from "./auth.module";
import {BotsModule} from "./bots.module";
import {BbttModule} from "./bbtt.module";
import {PerformanceModule} from "./performance.module";
import {ConfigModule} from "./config.module";

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
      ConfigModule,
  ],
  providers: [
      {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
      }
  ],
})
export class AppModule {}
