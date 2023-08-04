import { ElementHandle, Page as PPage } from "puppeteer";

export class PuppeteerPage {
  constructor(private _puppeter: PPage) {
    PuppeteerPage.OptimizeChargeTime(_puppeter);
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
    this._puppeter.evaluate;
    return this._puppeter.waitForSelector(selector);
  }

  async evaluate(fn: any, ...args: any[]): Promise<any> {
    return this._puppeter.evaluate(fn, ...args);
  }

  static async OptimizeChargeTime(page: PPage) {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() === "font" ||
        req.resourceType() === "image"
        // req.resourceType() === "stylesheet" // if unquoted sometimes pages doesnt charge correctly
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }
}
