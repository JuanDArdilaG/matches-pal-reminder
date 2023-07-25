import { Match } from "../../Matches/domain/Match";

export interface NotificatorMQTT {
  send(topic: string, message: string): Promise<void>;
}
