export class NotificatorMessage {
  constructor(
    private type: NotificatorMessageType,
    private title: string,
    private message: string
  ) {}
}

export enum NotificatorMessageType {
  MAIL,
  MQTT,
}
