"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
const notification_1 = require("./notification");
async function run() {
    const ligas = [
        {
            name: "LigaBetplay",
            config: {
                url: "https://dimayor.com.co/liga-betplay-dimayor/",
                rootSelector: ".Opta-js-main",
            },
        },
    ];
    const partidosTotales = [];
    for (const liga of ligas) {
        const browser = new browser_1.Browser(liga.config);
        const partidos = await browser.launch();
        console.log(`Partidos de ${liga.name}`);
        for (const partido of partidos) {
            partido.liga = liga.name;
        }
        const partidosDeHoy = filtrarPartidosPorFecha(partidos, new Date(Date.now()));
        partidosTotales.push(...partidosDeHoy);
        console.log("Partidos totales");
        console.log("count", partidosTotales.length);
        await browser.close();
    }
    (0, notification_1.sendMail)(partidosTotales);
}
run();
function filtrarPartidosPorFecha(partidos, fechaBuscada) {
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    const formatter = new Intl.DateTimeFormat("es-CO", options);
    // Convertir la fecha buscada a UTC-5
    const fechaBuscadaUTC5 = (0, browser_1.convertFromUTC)(fechaBuscada.toISOString().split("T")[0], fechaBuscada.toISOString().split("T")[1].split("-")[0].split(".")[0]);
    const fechaBuscadaString = formatter.format(fechaBuscadaUTC5);
    const partidasFiltradas = partidos.filter((partido) => {
        const fechaPartidaDate = new Date(partido.timestamp);
        if (isNaN(fechaPartidaDate.getTime())) {
            return false; // Ignorar partidas con fechas no válidas
        }
        // Convertir la fecha de la partida a UTC-5
        const fechaPartidaUTC5 = (0, browser_1.convertFromUTC)(fechaPartidaDate.toISOString().split("T")[0], fechaPartidaDate.toISOString().split("T")[1].split("-")[0].split(".")[0]);
        const fechaPartidaString = formatter.format(fechaPartidaUTC5);
        return fechaPartidaString === fechaBuscadaString;
    });
    return partidasFiltradas;
}
