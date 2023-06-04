import { Browser, convertFromUTC } from "./browser";
import { sendMail } from "./notification";
import { LigaConfig } from "./liga_config";
import { Partido } from "./partido";

async function run() {
  const ligas: LigaConfig[] = [
    {
      name: "LigaBetplay",
      config: {
        url: "https://dimayor.com.co/liga-betplay-dimayor/",
        rootSelector: ".Opta-js-main",
      },
    },
  ];
  const partidosTotales: Partido[] = [];
  for (const liga of ligas) {
    const browser = new Browser(liga.config);
    const partidos = await browser.launch();

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
}

run();

function filtrarPartidosPorFecha(
  partidos: Partido[],
  fechaBuscada: Date
): Partido[] {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  } as Intl.DateTimeFormatOptions;
  const formatter = new Intl.DateTimeFormat("es-CO", options);

  // Convertir la fecha buscada a UTC-5
  const fechaBuscadaUTC5 = convertFromUTC(
    fechaBuscada.toISOString().split("T")[0],
    fechaBuscada.toISOString().split("T")[1].split("-")[0].split(".")[0]
  );

  const fechaBuscadaString = formatter.format(fechaBuscadaUTC5);

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

    const fechaPartidaString = formatter.format(fechaPartidaUTC5);

    return fechaPartidaString === fechaBuscadaString;
  });

  return partidasFiltradas;
}
