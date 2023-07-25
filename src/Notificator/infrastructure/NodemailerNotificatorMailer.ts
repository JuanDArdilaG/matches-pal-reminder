import { Match } from "../../Matches/domain/Match";
import { NotificatorMailer } from "../domain/NotificatorMailer";
import { createTransport } from "nodemailer";

export class NodemailerNotificatorMailer implements NotificatorMailer {
  async send(matches: Match[]): Promise<void> {
    const matchesByLeague: { [liga: string]: Match[] } = {};
    for (const match of matches) {
      if (!matchesByLeague[match.liga.toString()]) {
        matchesByLeague[match.liga.toString()] = [];
      }
      matchesByLeague[match.liga.toString()].push(match);
    }
    // Crear el HTML para el correo electrónico
    let htmlData = "";
    for (const league in matchesByLeague) {
      htmlData += `<h2>${league}</h2>`;
      htmlData += "<table>";
      for (const partido of matchesByLeague[league]) {
        const formattedDate = partido.date.value.toLocaleDateString("es-CO", {
          hour: "numeric",
          minute: "numeric",
        });
        htmlData += "<tr>";
        htmlData += `<td>${formattedDate.split(",")[1]}</td>`;
        htmlData += `<td>${partido.jugador1}</td>`;
        htmlData += `<td>${partido.score1 ?? " "}</td>`;
        htmlData += `<td>-</td>`;
        htmlData += `<td>${partido.score2 ?? " "}</td>`;
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

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve();
        }
      });
    });
  }
}
