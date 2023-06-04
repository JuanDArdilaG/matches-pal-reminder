"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserCache = void 0;
const fs = __importStar(require("fs"));
class BrowserCache {
    save(partidas) {
        const data = {
            partidas,
            created: Date.now(),
            expiry: Date.now() + BrowserCache.TTL,
        };
        fs.writeFileSync(BrowserCache.FILE_NAME, JSON.stringify(data));
    }
    load() {
        if (!fs.existsSync(BrowserCache.FILE_NAME)) {
            throw new Error("No se pudo cargar el cache");
        }
        const data = fs.readFileSync(BrowserCache.FILE_NAME, "utf8");
        const partidas = JSON.parse(data);
        if (!partidas) {
            throw new Error("No se pudo cargar el cache");
        }
        return partidas;
    }
    get expiration() {
        const cachedData = this.load();
        return cachedData.expiry;
    }
    isExpired() {
        try {
            const cachedData = this.load();
            return Date.now() > cachedData.expiry;
        }
        catch (error) {
            return true;
        }
    }
    elapsedLifeTime() {
        try {
            const cachedData = this.load();
            const millisecondsElapsed = Date.now() - cachedData.created;
            const minutesElapsed = millisecondsElapsed / 1000 / 60;
            return minutesElapsed;
        }
        catch (error) {
            return 0;
        }
    }
}
exports.BrowserCache = BrowserCache;
BrowserCache.FILE_NAME = "partidas_cache.json";
BrowserCache.TTL = 60 * 60 * 1000;
