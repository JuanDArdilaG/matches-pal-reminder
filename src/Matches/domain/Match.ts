import { StringValueObject } from "@juandardilag/value-objects";
import { MatchDate } from "./MatchDate";

export class Match {
  constructor(
    private _liga: StringValueObject,
    readonly date: MatchDate,
    readonly jugador1: string,
    readonly score1: number,
    readonly score2: number,
    readonly jugador2: string,
    readonly html: string
  ) {}

  get liga(): StringValueObject {
    return this._liga;
  }

  set liga(val: StringValueObject) {
    this._liga = val;
  }
}
