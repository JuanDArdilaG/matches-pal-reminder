"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserCache = void 0;
const fs = require("fs");
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
