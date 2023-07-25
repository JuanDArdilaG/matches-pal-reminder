import { MatchDate } from "./Matches/domain/MatchDate";
import { Match } from "./Matches/domain/Match";
import { LeagueConfig } from "./League/domain/LeagueConfig";
import { Browser } from "./Browser/Browser/domain/Browser";
import { NodemailerNotificatorMailer } from "./Notificator/infrastructure/NodemailerNotificatorMailer";
import { MQTTNotificatorMQTT } from "./Notificator/infrastructure/mqttNotificatorMQTT";
import { Notificator } from "./Notificator/domain/Notificator";
import { FilterByDate } from "./Matches/application/FilterByDate";
import { Scrapper } from "./Scrapper/domain/Scrapper";

const mailer = new NodemailerNotificatorMailer();
const mqtt = new MQTTNotificatorMQTT("mqtt://localhost");
const notificator = new Notificator(mailer, mqtt);

const filterByDate = new FilterByDate();

export async function run() {
  const leagues: LeagueConfig[] = [
    new LeagueConfig("Liga Betplay", {
      url: "https://dimayor.com.co/liga-betplay-dimayor/",
      rootSelector: ".Opta-js-main",
      delay: 0,
    }),
    new LeagueConfig("Mundial Sub-20", {
      url: "https://www.fifa.com/fifaplus/en/tournaments/mens/u20worldcup/argentina-2023/scores-fixtures?sortBy=date&country=CO&wtw-filter=ALL",
      rootSelector: ".ff-p-0",
      delay: 0,
    }),
  ];
  const matches: Match[] = [];
  for (const league of leagues) {
    const scrapper = new Scrapper(new Browser(league.config));
    const matches = await scrapper.run();

    console.log(`Matches of ${league.name}`);

    for (const match of matches) {
      match.liga = league.name;
    }

    const todayMatches = await filterByDate.run(matches, MatchDate.now());

    matches.push(...todayMatches);

    console.log("count", matches.length);

    await scrapper.close();
  }

  notificator.sendMail(matches);
  notificator.sendMQTTMessage("macbook.notification", "Hello mqtt");
}
