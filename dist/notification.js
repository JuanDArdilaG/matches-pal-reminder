"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
function sendMail(partidos) {
    const partidosPorLiga = {};
    for (const partido of partidos) {
        if (!partidosPorLiga[partido.liga]) {
            partidosPorLiga[partido.liga] = [];
        }
        partidosPorLiga[partido.liga].push(partido);
    }
    // Crear el HTML para el correo electrónico
    let htmlData = "";
    for (const liga in partidosPorLiga) {
        htmlData += `<h1>${liga}</h1>`;
        htmlData += "<table>";
        for (const partido of partidosPorLiga[liga]) {
            const formattedDate = new Date(partido.timestamp + 5 * 60 * 60 * 1000).toLocaleDateString("es-CO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "numeric",
            });
            htmlData += "<tr>";
            htmlData += `<td>${formattedDate}</td>`;
            htmlData += `<td>${partido.jugador1}</td>`;
            htmlData += `<td>${partido.score1}</td>`;
            htmlData += `<td>${partido.score2}</td>`;
            htmlData += `<td>${partido.jugador2}</td>`;
            htmlData += "</tr>";
        }
        htmlData += "</table>";
    }
    console.log({ htmlData });
    return;
    let transporter = (0, nodemailer_1.createTransport)({
        service: "gmail",
        auth: {
            user: "juandardilag@gmail.com",
            pass: "enjjoaijqqunxzol",
        },
    });
    let mailOptions = {
        from: "partidos-del-dia@gmail.com",
        to: "juandardilag@gmail.com",
        subject: "Partidos Del Día",
        html: htmlData,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
}
exports.sendMail = sendMail;
