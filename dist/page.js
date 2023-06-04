"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
class Page {
    constructor(_puppeter) {
        this._puppeter = _puppeter;
        Page.OptimizeChargeTime(_puppeter);
    }
    get puppeteer() {
        return this._puppeter;
    }
    goto(url) {
        return this._puppeter.goto(url);
    }
    static async OptimizeChargeTime(page) {
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            if (req.resourceType() === "font" ||
                req.resourceType() === "image"
            // req.resourceType() === "stylesheet"
            ) {
                req.abort();
            }
            else {
                req.continue();
            }
        });
    }
}
exports.Page = Page;
