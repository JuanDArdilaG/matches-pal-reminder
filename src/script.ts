import { Browser } from "./browser";
import { sendMQTTMessage, sendMail } from "./notification";
import { LigaConfig } from "./liga_config";
import { Partido } from "./partido";
import { convertFromUTC } from "./dates";
import { Scrapper } from "./scrapper";

export async function run() {
  const ligas: LigaConfig[] = [
    {
      name: "Liga Betplay",
      config: {
        url: "https://dimayor.com.co/liga-betplay-dimayor/",
        rootSelector: ".Opta-js-main",
        delay: 0,
      },
    },
    {
      name: "Mundial Sub-20",
      config: {
        url: "https://www.fifa.com/fifaplus/en/tournaments/mens/u20worldcup/argentina-2023/scores-fixtures?sortBy=date&country=CO&wtw-filter=ALL",
        rootSelector: ".ff-p-0",
        delay: 0,
      },
    },
  ];
  const partidosTotales: Partido[] = [];
  for (const liga of ligas) {
    const browser = new Browser(liga.config);
    const scrapper = new Scrapper(browser);
    const partidos = await scrapper.run();

    console.log(`Partidos de ${liga.name}`);

    for (const partido of partidos) {
      partido.liga = liga.name;
    }

    const partidosDeHoy = filtrarPartidosPorFecha(
      partidos,
      new Date(Date.now())
    );

    partidosTotales.push(...partidosDeHoy);

    console.log("Partidos totales");
    console.log("count", partidosTotales.length);

    await browser.close();
  }

  sendMail(partidosTotales);
  sendMQTTMessage("macbook.notification", "Hello mqtt");
}

function filtrarPartidosPorFecha(
  partidos: Partido[],
  fechaBuscada: Date
): Partido[] {
  const partidasFiltradas = partidos.filter((partido) => {
    const fechaPartidaDate = new Date(partido.timestamp);
    if (isNaN(fechaPartidaDate.getTime())) {
      return false; // Ignorar partidas con fechas no válidas
    }

    // Convertir la fecha de la partida a UTC-5
    const fechaPartidaUTC5 = convertFromUTC(
      fechaPartidaDate.toISOString().split("T")[0],
      fechaPartidaDate.toISOString().split("T")[1].split("-")[0].split(".")[0]
    );

    return (
      fechaBuscada.toISOString().split("T")[0] ===
      fechaPartidaUTC5.toISOString().split("T")[0]
    );
  });

  return partidasFiltradas;
}
