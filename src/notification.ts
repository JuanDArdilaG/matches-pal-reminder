import { createTransport } from "nodemailer";
import { Partido } from "./partido";
import { convertFromUTC } from "./browser";

export function sendMail(partidos: Partido[]) {
  const partidosPorLiga: { [liga: string]: Partido[] } = {};
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
      const formattedDate = new Date(partido.timestamp).toLocaleDateString(
        "es-CO",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "numeric",
          minute: "numeric",
        }
      );
      htmlData += "<tr>";
      htmlData += `<td>${formattedDate}</td>`;
      htmlData += `<td>${partido.jugador1}</td>`;
      htmlData += `<td>${partido.score1 ?? "_"}</td>`;
      htmlData += `<td>-</td>`;
      htmlData += `<td>${partido.score2 ?? "_"}</td>`;
      htmlData += `<td>${partido.jugador2}</td>`;
      htmlData += "</tr>";
    }
    htmlData += "</table>";
  }
  console.log({ htmlData });

  let transporter = createTransport({
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
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
