import { IAutoRegStep } from "./AutoRegistration";
import { IRoomAlias } from "./RoomAliasSet";
import { IXJSBackendOpts } from "./xmppjs/XJSBackendOpts";
export class Config {

    public readonly bridge: IConfigBridge = {
        domain: "",
        homeserverUrl: "",
        mediaserverUrl: undefined,
        userPrefix: "_purple_",
        userStoreFile: "user-store.db",
        roomStoreFile: "room-store.db",
    };

    public readonly purple: IConfigPurple = {
        backendOpts: undefined,
        backend: "node-purple",
        enableDebug: false,
        pluginDir: "./node_modules/node-purple/deps/libpurple/",
    };

    public readonly autoRegistration: IConfigAutoReg = {
        enabled: false,
        protocolSteps: undefined,
    };

    public readonly bridgeBot: IConfigBridgeBot = {
        displayname: "Bifrost Bot",
        accounts: [],
    };

    public readonly logging: IConfigLogging = {
        console: "info",
        files: undefined,
    };

    public readonly profile: IConfigProfile = {
        updateInterval: 60000 * 15,
    };

    public readonly portals: IConfigPortals = {
        aliases: undefined,
    };

    public readonly metrics: IConfigMetrics = {
        enable: false,
    };

    public readonly provisioning: IConfigProvisioning = {
        enablePlumbing: true,
        requiredUserPL: 100,
    };

    public readonly tuning: IConfigTuning = {
        waitOnProfileBeforeSend: true,
        conferencePMFallbackCheck: false,
        waitOnJoinBeforePM: [],
    };
  /**
   * Apply a set of keys and values over the default config.
   * @param newConfig Config keys
   * @param configLayer Private parameter
   */
    public ApplyConfig(newConfig: {[key: string]: any}, configLayer: any = this) {
        Object.keys(newConfig).forEach((key) => {
            if (typeof(configLayer[key]) === "object" &&
                !Array.isArray(configLayer[key])) {
                    this.ApplyConfig(newConfig[key], this[key]);
                    return;
            }
            configLayer[key] = newConfig[key];
        });
    }
}

export interface IConfigBridge {
    domain: string;
    homeserverUrl: string;
    mediaserverUrl?: string;
    userPrefix: string;
    userStoreFile?: string;
    roomStoreFile?: string;
}

export interface IConfigPurple {
    backendOpts: {}|IXJSBackendOpts|undefined;
    backend: "node-purple"|"xmpp.js";
    enableDebug: boolean;
    pluginDir: string;
}

export interface IConfigAutoReg {
    enabled: boolean;
    protocolSteps: {[protocol: string]: IAutoRegStep} | undefined;
}

export interface IConfigBridgeBot {
    displayname: string;
    accounts: IBridgeBotAccount[]; // key -> parameter value
}

export interface IBridgeBotAccount {
    name: string;
    protocol: string;
}

export interface IConfigProfile {
    updateInterval: number;
}

export interface IConfigPortals {
    aliases: {[regex: string]: IRoomAlias} | undefined;
}

export interface IConfigProvisioning {
    enablePlumbing: boolean;
    requiredUserPL: number;
}

interface IConfigMetrics {
    enable: boolean;
}

interface IConfigLogging {
    console: "debug"|"info"|"warn"|"error"|"off";
    files?: {[filename: string]: "debug"|"info"|"warn"|"error"};
}

interface IConfigTuning {
    // Don't send a message or join a room before setting a profile picture
    waitOnProfileBeforeSend: boolean;
    // A nasty hack to check the domain for conf* to see if the PM is coming from a MUC.
    // This is only really needed for legacy clients that don't implement xmlns
    conferencePMFallbackCheck: boolean;
    // Don't send messages from the remote protocol until we have seen them join.
    // A list of prefixes to check.
    waitOnJoinBeforePM: string[];
}
