"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMQTTMessage = exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
const mqtt_1 = __importDefault(require("mqtt"));
async function sendMail(partidos) {
    var _a, _b;
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
        htmlData += `<h2>${liga}</h2>`;
        htmlData += "<table>";
        for (const partido of partidosPorLiga[liga]) {
            const formattedDate = new Date(partido.timestamp).toLocaleDateString("es-CO", {
                hour: "numeric",
                minute: "numeric",
            });
            htmlData += "<tr>";
            htmlData += `<td>${formattedDate.split(",")[1]}</td>`;
            htmlData += `<td>${partido.jugador1}</td>`;
            htmlData += `<td>${(_a = partido.score1) !== null && _a !== void 0 ? _a : " "}</td>`;
            htmlData += `<td>-</td>`;
            htmlData += `<td>${(_b = partido.score2) !== null && _b !== void 0 ? _b : " "}</td>`;
            htmlData += `<td>${partido.jugador2}</td>`;
            htmlData += "</tr>";
        }
        htmlData += "</table>";
    }
    console.log({ htmlData });
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
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject(error);
            }
            else {
                console.log("Email sent: " + info.response);
                resolve();
            }
        });
    });
}
exports.sendMail = sendMail;
async function sendMQTTMessage(topic, message) {
    const client = mqtt_1.default.connect("mqtt://localhost"); // url de tu broker
    client.on("connect", function () {
        client.publish(topic, message);
        console.log("Mensaje enviado");
    });
}
exports.sendMQTTMessage = sendMQTTMessage;
