import { pingPromise, Data } from "minecraft-pinger";
import * as console from "node:console";


export let serverInfo: Data | null = null

export async function fetchServerInfo() {
    try {
        serverInfo = await pingPromise('2b2t.xin', 25565);
        console.log("server info updated: " + serverInfo?.description?.text);
    } catch (e) {
        console.log("server info fetch failed: " + e);
    }
}

export async function updateServerInfo() {
    while (true) {
        await fetchServerInfo();
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

}
