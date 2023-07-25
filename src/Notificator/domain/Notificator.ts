import { Match } from "../../Matches/domain/Match";
import { NotificatorMQTT } from "./NotificatorMQTT";
import { NotificatorMailer } from "./NotificatorMailer";

export class Notificator {
  constructor(
    private mailer: NotificatorMailer,
    private mqtt: NotificatorMQTT
  ) {}

  async sendMail(matches: Match[]): Promise<void> {
    await this.mailer.send(matches);
  }

  async sendMQTTMessage(topic: string, message: string): Promise<void> {
    await this.mqtt.send(topic, message);
  }
}
