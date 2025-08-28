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

import axios from "axios";
import { PrismaClient } from "@prisma/client";
import {config} from "./main";
import console from 'node:console';

class Bot{
    private readonly id: number;
    private readonly url: string;
    private readonly token: string;
    private version: string;
    private server: string;
    private username: string;
    private available: boolean = false;

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
            const statusUrl = new URL("status", this.url)
            const statusResponse = await axios.get(
                statusUrl.toString(),
                {
                    headers: {
                        "Authorization": `Bearer ${this.token}`
                    },
                    proxy: false,
                }
            );
            console.log(`Bot ${this.id} updated successfully:`, statusResponse.data);
            this.version = statusResponse.data.version;
            this.server = statusResponse.data.server;
            this.username = statusResponse.data.username;
            this.available = true;
        } catch (error) {
            console.error(`Bot ${this.id} update failed:`, error.message);
            this.server = "Unknown";
            this.version = "Unknown";
            this.username = "Unknown";
            this.available = false;
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
            await bot.fetchUpdate();
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
        await new Promise(resolve => setTimeout(resolve, config?.bots_fetch_interval || 10000));
    }
}