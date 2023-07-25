import { Match } from "../../Matches/domain/Match";

export interface NotificatorMailer {
  send(matches: Match[]): Promise<void>;
}
