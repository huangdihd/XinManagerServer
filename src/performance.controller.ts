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
