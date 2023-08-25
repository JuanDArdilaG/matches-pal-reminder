import { Browser } from "../../Browser/domain/Browser";
import { ScrapperResult } from "./ScrapperResult";

export class Scrapper {
  constructor(private _browser: Browser) {
    if (_browser.delay === 0) {
      _browser.delay = Math.random() * (7000 - 500) + 500;
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async run(): Promise<ScrapperResult> {
    return await this._browser.scrape();
  }

  async close(): Promise<void> {
    await this._browser.close();
  }
}
