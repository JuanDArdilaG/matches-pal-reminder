import { DateValueObject } from "@juandardilag/value-objects";
import { Criteria } from "../../../Filter/Criteria";
import { Filter } from "../../../Filter/Filter";
import { MatchDate } from "../../../Matches/domain/MatchDate";
import { MatchDateCriteria } from "../../../Matches/domain/filter/MatchDateCriteria";
import { Match } from "../../../Matches/domain/Match";

export type ScrapperSingleResult<T extends Object> = {
  date: DateValueObject;
  value: T;
};

export class ScrapperResult {
  private _filter: Filter<Match> = new Filter();

  constructor(private _result: ScrapperSingleResult<Match>[]) {}

  static fromMatches(matches: Match[]): ScrapperResult {
    return new ScrapperResult(
      matches.map((match) => {
        return {
          date: match.date,
          value: match,
        };
      })
    );
  }

  filter(criteria: Criteria<Match>): Match[] {
    return this._filter.run(
      this._result.map((res) => res.value),
      criteria
    );
  }

  filterByMatchDate(date: MatchDate): Match[] {
    return this._filter.run(
      this._result.map((res) => res.value),
      new MatchDateCriteria(date)
    );
  }
}
