"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const browser_1 = require("./browser");
const notification_1 = require("./notification");
const dates_1 = require("./dates");
const scrapper_1 = require("./scrapper");
async function run() {
    const ligas = [
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
    const partidosTotales = [];
    for (const liga of ligas) {
        const browser = new browser_1.Browser(liga.config);
        const scrapper = new scrapper_1.Scrapper(browser);
        const partidos = await scrapper.run();
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
    (0, notification_1.sendMQTTMessage)("macbook.notification", "Hello mqtt");
}
exports.run = run;
function filtrarPartidosPorFecha(partidos, fechaBuscada) {
    const partidasFiltradas = partidos.filter((partido) => {
        const fechaPartidaDate = new Date(partido.timestamp);
        if (isNaN(fechaPartidaDate.getTime())) {
            return false; // Ignorar partidas con fechas no válidas
        }
        // Convertir la fecha de la partida a UTC-5
        const fechaPartidaUTC5 = (0, dates_1.convertFromUTC)(fechaPartidaDate.toISOString().split("T")[0], fechaPartidaDate.toISOString().split("T")[1].split("-")[0].split(".")[0]);
        return (fechaBuscada.toISOString().split("T")[0] ===
            fechaPartidaUTC5.toISOString().split("T")[0]);
    });
    return partidasFiltradas;
}
