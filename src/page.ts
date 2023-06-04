import { Page as PuppeteerPage } from "puppeteer-core";

export class Page {
  constructor(private _puppeter: PuppeteerPage) {
    Page.OptimizeChargeTime(_puppeter);
  }

  get puppeteer(): PuppeteerPage {
    return this._puppeter;
  }

  goto(url: string) {
    return this._puppeter.goto(url);
  }

  static async OptimizeChargeTime(page: PuppeteerPage) {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() === "font" ||
        req.resourceType() === "image"
        // req.resourceType() === "stylesheet"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }
}
