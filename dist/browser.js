"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Browser = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const page_1 = require("./page");
const browser_cache_1 = require("./browser_cache");
class Browser {
    constructor(_config) {
        this._config = _config;
        this._cache = new browser_cache_1.BrowserCache();
    }
    async launch() {
        if (!this._cache.isExpired()) {
            const minutesUntilExpiry = (this._cache.expiration - Date.now()) / 1000 / 60;
            const elapsedLifeTime = this._cache.elapsedLifeTime();
            console.log(`Returning cached data. Created ${elapsedLifeTime.toFixed(0)} minutes ago. Expiry in ${minutesUntilExpiry.toFixed(0)} minutes.`);
            try {
                return this._cache.load().partidas;
            }
            catch (error) {
                console.log("Error loading from cache", error);
            }
        }
        this._puppeter = await puppeteer_1.default.launch({
            headless: "new",
            args: ["--no-sandbox"],
        });
        if (!this._puppeter) {
            throw new Error("No se pudo lanzar el navegador");
        }
        const page = (await this.newPage()).puppeteer;
        await page.goto(this._config.url);
        const element = await page.waitForSelector(this._config.rootSelector);
        const partidas = await page.evaluate((element) => {
            var _a, _b, _c, _d, _e, _f;
            const convertTextualDate = (textualDate) => {
                // Separamos la fecha en componentes
                const components = textualDate.split(" ");
                // Removemos el día de la semana ("Saturday")
                components.shift();
                // Convertimos el mes de español a inglés
                const spanishMonths = [
                    "enero",
                    "febrero",
                    "marzo",
                    "abril",
                    "mayo",
                    "junio",
                    "julio",
                    "agosto",
                    "septiembre",
                    "octubre",
                    "noviembre",
                    "diciembre",
                ];
                const englishMonths = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ];
                const monthIndex = spanishMonths.indexOf(components[1].toLowerCase());
                if (monthIndex !== -1) {
                    components[1] = englishMonths[monthIndex];
                }
                // Creamos la nueva cadena de fecha sin el día de la semana
                const dateString = components.join(" ");
                const date = new Date(dateString);
                return date;
            };
            const convertToUTC = (dateString, timeString) => {
                let adjustedDate;
                if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
                    let dateLocal = new Date(`${dateString}T${timeString}`);
                    let localTimeInMilliseconds = dateLocal.getTime();
                    adjustedDate = new Date(localTimeInMilliseconds);
                }
                else {
                    adjustedDate = new Date(`${dateString}T07:00:00`);
                }
                return adjustedDate;
            };
            const resultado = [];
            let fechaActual = "";
            const rows = element === null || element === void 0 ? void 0 : element.querySelectorAll("tr");
            if (!rows) {
                return resultado;
            }
            for (const row of rows) {
                const cells = Array.from(row.querySelectorAll("td"));
                const cellsHtml = cells.map((cell) => cell.innerHTML).join("");
                const horaElement = cells[0];
                const jugador1Element = cells[1];
                const score1Element = cells[2];
                const score2Element = cells[4];
                const jugador2Element = cells[5];
                if (jugador1Element &&
                    score1Element &&
                    score2Element &&
                    jugador2Element) {
                    const horaActual = ((_a = horaElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
                    const jugador1 = ((_b = jugador1Element.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
                    const score1 = ((_c = score1Element.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || "";
                    const score2 = ((_d = score2Element.textContent) === null || _d === void 0 ? void 0 : _d.trim()) || "";
                    const jugador2 = ((_e = jugador2Element.textContent) === null || _e === void 0 ? void 0 : _e.trim()) || "";
                    const date = convertTextualDate(fechaActual);
                    resultado.push({
                        timestamp: convertToUTC(date.toISOString().split("T")[0], horaActual + ":00").getTime(),
                        jugador1,
                        score1: parseInt(score1),
                        score2: parseInt(score2),
                        jugador2,
                        liga: "",
                        html: cellsHtml,
                    });
                }
                else if (horaElement) {
                    const fechaElement = horaElement.querySelector("td h3");
                    if (fechaElement) {
                        fechaActual = ((_f = fechaElement.textContent) === null || _f === void 0 ? void 0 : _f.trim()) || "";
                    }
                }
            }
            return resultado;
        }, element);
        this._cache.save(partidas);
        return partidas;
    }
    async newPage() {
        if (!this._puppeter) {
            throw new Error("No se pudo lanzar el navegador");
        }
        return new page_1.Page(await this._puppeter.newPage());
    }
    async close() {
        var _a;
        await ((_a = this._puppeter) === null || _a === void 0 ? void 0 : _a.close());
    }
}
exports.Browser = Browser;
