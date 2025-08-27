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

import {Controller, Get} from "@nestjs/common";
import si from "systeminformation"
import * as os from "node:os";

@Controller('performance')
export class PerformanceController {
    @Get()
    async getPerformance() {
        const memTotal = os.totalmem()
        const memFree = os.freemem()
        const memUsed = memTotal - memFree
        const memUsage = (memUsed / memTotal) * 100
        const cpuUsage = await si.currentLoad()
        return {
            cpu: cpuUsage.currentLoad,
            memory: memUsage,
        }
    }
}
