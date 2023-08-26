import { ElementHandle, Page as PPage } from "puppeteer";

export class PuppeteerPage {
  constructor(private _puppeter: PPage) {
    PuppeteerPage.optimizeChargeTime(_puppeter);
    _puppeter.setDefaultNavigationTimeout(0);
  }

  get puppeteer(): PPage {
    return this._puppeter;
  }

  goto(url: string) {
    return this._puppeter.goto(url);
  }

  async waitForSelector(
    selector: string
  ): Promise<ElementHandle<Element> | null> {
    return this._puppeter.waitForSelector(selector);
  }

  async evaluate(fn: any, ...args: any[]): Promise<any> {
    return this._puppeter.evaluate(fn, ...args);
  }

  static async optimizeChargeTime(page: PPage) {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() === "font" ||
        req.resourceType() === "image" ||
        req.resourceType() === "media" ||
        req.resourceType() === "websocket"
        // req.resourceType() === "stylesheet" // if unquoted sometimes pages doesnt charge correctly
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }
}
