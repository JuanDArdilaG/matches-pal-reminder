import puppeteer, { Browser as PuppeteerBrowser } from "puppeteer";
import { BrowserConfig } from "./browser_config";
import { Page } from "./page";
import { BrowserCache } from "./browser_cache";
import { Partido } from "./partido";

export class Browser {
  private _cache: BrowserCache;
  private _puppeter: PuppeteerBrowser | undefined;
  constructor(private _config: BrowserConfig) {
    this._cache = new BrowserCache();
  }

  async launch(): Promise<Partido[]> {
    if (!this._cache.isExpired()) {
      const minutesUntilExpiry =
        (this._cache.expiration - Date.now()) / 1000 / 60;
      const elapsedLifeTime = this._cache.elapsedLifeTime();
      console.log(
        `Returning cached data. Created ${elapsedLifeTime.toFixed(
          0
        )} minutes ago. Expiry in ${minutesUntilExpiry.toFixed(0)} minutes.`
      );

      try {
        return this._cache.load().partidas;
      } catch (error) {
        console.log("Error loading from cache", error);
      }
    }
    this._puppeter = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    if (!this._puppeter) {
      throw new Error("No se pudo lanzar el navegador");
    }
    const page = (await this.newPage()).puppeteer;

    await page.goto(this._config.url);
    const element = await page.waitForSelector(this._config.rootSelector);

    const partidas = await page.evaluate((element) => {
      const convertTextualDate = (textualDate: string): Date => {
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
      const convertToUTC = (dateString: string, timeString: string): Date => {
        let adjustedDate;

        if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
          let dateLocal = new Date(`${dateString}T${timeString}`);
          let localTimeInMilliseconds = dateLocal.getTime();
          adjustedDate = new Date(localTimeInMilliseconds);
        } else {
          adjustedDate = new Date(`${dateString}T07:00:00`);
        }

        return adjustedDate;
      };

      const resultado: Partido[] = [];

      let fechaActual = "";

      const rows = element?.querySelectorAll("tr");

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

        if (
          jugador1Element &&
          score1Element &&
          score2Element &&
          jugador2Element
        ) {
          const horaActual = horaElement.textContent?.trim() || "";
          const jugador1 = jugador1Element.textContent?.trim() || "";
          const score1 = score1Element.textContent?.trim() || "";
          const score2 = score2Element.textContent?.trim() || "";
          const jugador2 = jugador2Element.textContent?.trim() || "";
          const date = convertTextualDate(fechaActual);

          resultado.push({
            timestamp: convertToUTC(
              date.toISOString().split("T")[0],
              horaActual + ":00"
            ).getTime(),
            jugador1,
            score1: parseInt(score1),
            score2: parseInt(score2),
            jugador2,
            liga: "",
            html: cellsHtml,
          });
        } else if (horaElement) {
          const fechaElement = horaElement.querySelector("td h3");
          if (fechaElement) {
            fechaActual = fechaElement.textContent?.trim() || "";
          }
        }
      }

      return resultado;
    }, element);

    this._cache.save(partidas);
    return partidas;
  }

  async newPage(): Promise<Page> {
    if (!this._puppeter) {
      throw new Error("No se pudo lanzar el navegador");
    }
    return new Page(await this._puppeter.newPage());
  }

  async close(): Promise<void> {
    await this._puppeter?.close();
  }
}

export function convertToUTC(dateString: string, timeString: string): Date {
  let adjustedDate;

  if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
    let dateLocal = new Date(`${dateString}T${timeString}`);
    let localTimeInMilliseconds = dateLocal.getTime();
    adjustedDate = new Date(localTimeInMilliseconds);
  } else {
    adjustedDate = new Date(`${dateString}T07:00:00`);
  }

  return adjustedDate;
}

export function convertFromUTC(dateString: string, timeString: string): Date {
  let adjustedDate;

  if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
    let dateInUTC = new Date(`${dateString}T${timeString}Z`);
    let utcTimeInMilliseconds = dateInUTC.getTime() - 5 * 60 * 60 * 1000;
    adjustedDate = new Date(utcTimeInMilliseconds);
  } else {
    adjustedDate = new Date(`${dateString}T07:00:00`);
  }

  return adjustedDate;
}
