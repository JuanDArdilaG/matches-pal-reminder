"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrapper = void 0;
class Scrapper {
    constructor(_browser) {
        this._browser = _browser;
        _browser.config.delay = Math.random() * (7000 - 500) + 500;
    }
    async run() {
        return await this._browser.launch();
    }
}
exports.Scrapper = Scrapper;
