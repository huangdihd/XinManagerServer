import axios from "axios";
import { PrismaClient } from "@prisma/client";

class Bot{
    private readonly id: number;
    private readonly url: string;
    private readonly token: string;
    private version: string;
    private server: string;
    private username: string;

    constructor(prismaBot: {id: number, url: string, token: string}) {
        this.id = prismaBot.id;
        this.url = prismaBot.url;
        this.token = prismaBot.token;
        this.server = "Unknown";
        this.version = "Unknown";
        this.username = "Unknown";
    }

    public getId(): number {
        return this.id;
    }

    public getUrl(): string {
        return this.url;
    }

    public getToken(): string {
        return this.token;
    }

    public async fetchUpdate(): Promise<void> {
        if (!this.url) {
            console.error(`Bot ${this.id} has no URL configured`);
            return;
        }
        try {
            const statusResponse = await axios.get(new URL("status", this.url).toString(), {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            console.log(`Bot ${this.id} updated successfully:`, statusResponse.data);
            this.version = statusResponse.data.version;
            this.server = statusResponse.data.server;
            this.username = statusResponse.data.username;
        } catch (error) {
            console.error(`Bot ${this.id} update failed:`, error.message);
            this.server = "Unknown";
            this.version = "Unknown";
            this.username = "Unknown";
        }
    }

    public getVersion(): string {
        return this.version;
    }

    public getServer(): string {
        return this.server;
    }
    public getUsername(): string {
        return this.username;
    }
}

export class BotManager {
    private static _instance: BotManager = new BotManager();
    private bots = new Map<number, Bot>();
    private prisma:PrismaClient = new PrismaClient()
    private constructor(){
        process.on('beforeExit', async () => {
            await this.prisma.$disconnect().catch(() => {});
        });
    }

    public async loadFromDB(): Promise<void> {
        const dbBots = await this.prisma.bot.findMany();
        for (const dbBot of dbBots) {
            this.bots.set(dbBot.id, new Bot(dbBot));
        }
        console.log("loaded " + this.bots.size + " bots from db");
    }

    public static getInstance(): BotManager {
        return BotManager._instance;
    }

    public getBots(): MapIterator<Bot> {
        return this.bots.values();
    }

    public getBot(id: number): Bot | undefined {
        return this.bots.get(id);
    }

    public hasBot(id: number): boolean {
        return this.bots.has(id);
    }

    public async addBot(url: string, token: string) {
        const dbBot = await this.prisma.bot.create({
            data: {
                url: url,
                token: token,
            }
        });
        const bot = new Bot(dbBot);
        this.bots.set(dbBot.id, bot);
        console.log(`Bot ${dbBot.id} added to db`);
        await bot.fetchUpdate();
        return bot;
    }

    public removeBot(id: number): void {
        this.prisma.bot.delete({
            where: {
                id: id,
            }
        })
            .then(() => {
                this.bots.delete(id);
                console.log(`Bot ${id} removed from db`);
            })
    }

    public async fetchUpdates(): Promise<void> {
        console.log("fetching updates");
        for (const bot of this.getBots()) {
            bot.fetchUpdate();
        }
    }
}

export async function updateBots() {
    while (true) {
        try {
            await BotManager.getInstance().fetchUpdates();
        } catch (error) {
            console.error('Update loop error:', error);
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}