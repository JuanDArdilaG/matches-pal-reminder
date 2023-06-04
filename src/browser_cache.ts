import * as fs from "fs";
import { Partido } from "./partido";

interface CacheData {
  partidas: Partido[];
  expiry: number;
  created: number;
}

export class BrowserCache {
  static FILE_NAME = "partidas_cache.json";
  static TTL = 60 * 60 * 1000;

  save(partidas: Partido[]): void {
    const data: CacheData = {
      partidas,
      created: Date.now(),
      expiry: Date.now() + BrowserCache.TTL,
    };

    fs.writeFileSync(BrowserCache.FILE_NAME, JSON.stringify(data));
  }

  load(): CacheData {
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

  get expiration(): number {
    const cachedData = this.load();
    return cachedData.expiry;
  }

  isExpired(): boolean {
    try {
      const cachedData = this.load();
      return Date.now() > cachedData.expiry;
    } catch (error) {
      return true;
    }
  }

  elapsedLifeTime(): number {
    try {
      const cachedData = this.load();

      const millisecondsElapsed = Date.now() - cachedData.created;
      const minutesElapsed = millisecondsElapsed / 1000 / 60;

      return minutesElapsed;
    } catch (error) {
      return 0;
    }
  }
}
