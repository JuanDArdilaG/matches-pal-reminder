import { Browser } from "./browser";
import { Partido } from "./partido";

export class Scrapper {
  constructor(private _browser: Browser) {
    _browser.config.delay = Math.random() * (7000 - 500) + 500;
  }

  async run(): Promise<Partido[]> {
    return await this._browser.launch();
  }
}
