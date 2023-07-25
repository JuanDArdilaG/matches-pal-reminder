import puppeteer, { Browser as PBrowser } from "puppeteer";
import { Browser } from "../domain/Browser";
import { BrowserConfig } from "../domain/BrowserConfig";
import { BrowserCache } from "../domain/BrowserCache";
import { ScrapperResult } from "../../../Scrapper/domain/ScrapperResult";
import { PuppeteerPage } from "../../Page/infrastructure/PuppeteerPage";
import { StringValueObject } from "@juandardilag/value-objects";
import { Match } from "../../../Matches/domain/Match";
import { MatchDate } from "../../../Matches/domain/MatchDate";

export class PuppeteerBrowser implements Browser {
  constructor(
    private _config: BrowserConfig,
    private _cache: BrowserCache,
    private _browser: PBrowser | undefined
  ) {}

  get delay(): number {
    return this._config.delay;
  }

  set delay(value: number) {
    this._config.delay = value;
  }

  wait() {
    return new Promise((resolve) => setTimeout(resolve, this._config.delay));
  }

  async newPage(): Promise<PuppeteerPage> {
    if (!this._browser) {
      throw new Error("No se pudo lanzar el navegador");
    }
    return new PuppeteerPage(await this._browser.newPage());
  }

  async run(): Promise<ScrapperResult> {
    if (!this._cache.isExpired()) {
      const elapsedLifeTime = this._cache.elapsedLifeTime;
      console.debug(
        `Returning cached data. Created ${elapsedLifeTime} minutes ago. Expiry in ${this._cache.minutesToExpire} minutes.`
      );

      try {
        return ScrapperResult.fromMatches(this._cache.load().matches);
      } catch (error) {
        console.log("Error loading from cache", error);
      }
    }
    this._browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
      executablePath: "/usr/bin/google-chrome",
    });
    if (!this._browser) {
      throw new Error("No se pudo lanzar el navegador");
    }
    const page = await this.newPage();

    await page.goto(this._config.url);
    const element = await page.waitForSelector(this._config.rootSelector);
    await this.wait();

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

      const resultado: Match[] = [];

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

          resultado.push(
            new Match(
              StringValueObject.empty(),
              new MatchDate(new Date(`${date.toISOString().split("T")[0]}T${timeString}`);),
              convertToUTC(
                ,
                horaActual + ":00"
              ).getTime(),
              jugador1,
              parseInt(score1),
              parseInt(score2),
              jugador2,
              cellsHtml
            )
          );
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
    return ScrapperResult.fromMatches(partidas);
  }

  async close(): Promise<void> {
    await this._browser?.close();
  }
}
