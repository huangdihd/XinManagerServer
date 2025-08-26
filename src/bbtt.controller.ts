import {Controller, Get} from "@nestjs/common";
import {fetchServerInfo, serverInfo} from "./bbtt";

@Controller('bbtt')
export class BbttController {
    @Get()
    getServerInfo(){
        return serverInfo;
    }

    @Get('update')
    async updateServerInfo(){
        await fetchServerInfo();
        return serverInfo;
    }
}