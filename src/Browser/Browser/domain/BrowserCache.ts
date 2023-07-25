import { Match } from "../../../Matches/domain/Match";
import fs from "fs";

const ErrorLoadingCache = new Error("No se pudo cargar el cache");

interface CacheData {
  matches: Match[];
  expiry: number;
  created: number;
}

export type BrowserCacheConfig = {
  fileName: string;
  ttl: number;
};

export class BrowserCache {
  constructor(private _config: BrowserCacheConfig) {}

  save(partidas: Match[]): void {
    const data: CacheData = {
      matches: partidas,
      created: Date.now(),
      expiry: Date.now() + this._config.ttl,
    };

    fs.writeFileSync(this._config.fileName, JSON.stringify(data));
  }

  load(): CacheData {
    if (!fs.existsSync(this._config.fileName)) {
      throw ErrorLoadingCache;
    }

    const data = fs.readFileSync(this._config.fileName, "utf8");
    const partidas = JSON.parse(data);
    if (!partidas) {
      throw ErrorLoadingCache;
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

  get minutesToExpire(): string {
    return ((this.expiration - Date.now()) / 1000 / 60).toFixed(0);
  }

  get elapsedLifeTime(): string {
    try {
      const cachedData = this.load();

      const millisecondsElapsed = Date.now() - cachedData.created;
      const minutesElapsed = millisecondsElapsed / 1000 / 60;

      return minutesElapsed.toFixed(0);
    } catch (error) {
      return "0";
    }
  }
}
