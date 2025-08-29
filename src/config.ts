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

import fs from "node:fs";
import console from "node:console";
import {randomStringGenerator} from "@nestjs/common/utils/random-string-generator.util";
import {config} from "./main";

export interface Config {
    password: string;
    cookie_secret: string;
    bots_fetch_interval: number;
    bbtt_fetch_interval: number;
}

export function loadConfig() {
    let cfg: Config | undefined = undefined;
    if (fs.existsSync("../config.json")) {
        cfg = JSON.parse(fs.readFileSync("../config.json", "utf-8")) as Config;
    }
    if (cfg === undefined) {
        console.log("config.json is empty");
        console.log("try to create config.json");
        cfg = {
            password: randomStringGenerator(),
            cookie_secret: randomStringGenerator(),
            bots_fetch_interval: 10000,
            bbtt_fetch_interval: 10000,
        }
        fs.writeFileSync("../config.json", JSON.stringify(cfg, null, 4));
    }

    console.log("password: " + cfg.password);
    return cfg
}

export function saveConfig() {
    fs.writeFileSync("../config.json", JSON.stringify(config, null, 4));
}