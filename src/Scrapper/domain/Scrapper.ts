import { Browser } from "../../Browser/Browser/domain/Browser";
import { BrowserCache } from "../../Browser/Browser/domain/BrowserCache";
import { BrowserConfig } from "../../Browser/Browser/domain/BrowserConfig";
import { Match } from "../../Matches/domain/Match";
import { Page } from "../../Browser/Page/domain/Page";
import { ScrapperResult } from "./ScrapperResult";

export class Scrapper {
  private _cache: BrowserCache;
  constructor(private _browser: Browser) {
    if (_browser.delay === 0) {
      _browser.delay = Math.random() * (7000 - 500) + 500;
    }
  }

  /*constructor(private _config: BrowserConfig) {
    this._cache = new BrowserCache({
      fileName: "partidas_cache.json",
      ttl: 60 * 60 * 1000,
    });
  }*/

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  abstract run(): Promise<ScrapperResult>;

  async newPage(): Promise<Page> {
    if (!this._puppeter) {
      throw new Error("No se pudo lanzar el navegador");
    }
    return new Page(await this._puppeter.newPage());
  }

  async close(): Promise<void> {
    await this._puppeter?.close();
  }

  async run(): Promise<ScrapperResult[]> {
    return await this._browser.run();
  }

  async close(): Promise<void> {
    await this._browser.close();
  }
}
