import { MatchDate } from "./Matches/domain/MatchDate";
import { Match } from "./Matches/domain/Match";
import { LeagueConfig } from "./League/domain/LeagueConfig";
import { NodemailerNotificatorMailer } from "./Notificator/infrastructure/NodemailerNotificatorMailer";
import { MQTTNotificatorMQTT } from "./Notificator/infrastructure/mqttNotificatorMQTT";
import { Notificator } from "./Notificator/domain/Notificator";
import { Scrapper } from "./Scrapper/domain/Scrapper";
import dotenv from "dotenv";
import {
  EmailValueObject,
  StringValueObject,
} from "@juandardilag/value-objects";
import { PuppeteerBrowser } from "./Browser/Browser/infrastructure/PuppeteerBrowser";
import { BrowserCache } from "./Browser/Browser/domain/BrowserCache";

dotenv.config();

const mailer = new NodemailerNotificatorMailer(
  new EmailValueObject("juandardilag@gmail.com")
);
const mqtt = new MQTTNotificatorMQTT("mqtt://localhost");
const notificator = new Notificator(mailer, mqtt);

export async function run() {
  const leagues: LeagueConfig[] = [
    new LeagueConfig(
      new StringValueObject("COLAH"), // country-division-genre
      new StringValueObject("Liga Betplay"),
      {
        url: "https://dimayor.com.co/liga-betplay-dimayor/",
        rootSelector: ".Opta-js-main",
        delay: 0,
      }
    ),
    new LeagueConfig(
      new StringValueObject("MUN20H"),
      new StringValueObject("Mundial Sub-20"),
      {
        url: "https://www.fifa.com/fifaplus/en/tournaments/mens/u20worldcup/argentina-2023/scores-fixtures?sortBy=date&country=CO&wtw-filter=ALL",
        rootSelector: ".ff-p-0",
        delay: 0,
      }
    ),
  ];
  const todayMatches: Match[] = [];
  for (const league of leagues) {
    const cache = BrowserCache.oneDayCache(
      `./cache/matches/${league.name}.json`
    );
    const scrapper = new Scrapper(
      PuppeteerBrowser.withBrowserConfigAndCache(league.browserConfig, cache)
    );

    const matches = (await scrapper.run())
      .filterByMatchDate(MatchDate.now())
      .map((match) => {
        match.liga = league.name;
        return match;
      });

    matches.push(...matches);

    scrapper.close();
  }

  notificator.sendMail(todayMatches);
  notificator.sendMQTTMessage("macbook.notification", "Hello mqtt");
}
