export interface BotConfig {
    account: Account;
    owner: string;
    plugin: Plugin;
    advances: Advances;
}

export interface Account {
    onlineMode: boolean;
    name: string;
    password: string;
    fullSession: string;
}

export interface Plugin {
    directory: string;
}

export interface Advances {
    enableJLine: boolean;
    enableTranslation: boolean;
    enableHighStability: boolean;
}