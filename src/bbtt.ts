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

import { pingPromise, Data } from "minecraft-pinger";
import * as console from "node:console";
import {config} from "./main";

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
        await new Promise(resolve => setTimeout(resolve, config?.bbtt_fetch_interval || 10000));
    }

}
