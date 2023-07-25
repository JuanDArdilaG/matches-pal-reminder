import { NotificatorMQTT } from "../domain/NotificatorMQTT";
import mqtt from "mqtt";

export class MQTTNotificatorMQTT implements NotificatorMQTT {
  constructor(private _host: string) {}

  async send(topic: string, message: string): Promise<void> {
    const client = mqtt.connect(this._host);
    client.on("connect", function () {
      client.publish(topic, message);
      console.log("Mensaje enviado");
    });
  }
}
