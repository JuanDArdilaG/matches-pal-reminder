import { Criteria } from "../../../Filter/Criteria";
import { Match } from "../Match";
import { MatchDate } from "../MatchDate";

export class MatchDateCriteria implements Criteria<Match> {
  constructor(private _date: MatchDate) {}

  meet(item: Match): boolean {
    const currentMatchDate = new MatchDate(item.date.value);
    if (!currentMatchDate.checkValidDate()) {
      return false;
    }

    const utc5MatchDate = currentMatchDate.toUTC5();
    return utc5MatchDate.equalDates(this._date);
  }
}
