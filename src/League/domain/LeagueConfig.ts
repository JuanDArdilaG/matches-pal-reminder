import { StringValueObject } from "@juandardilag/value-objects";
import { BrowserConfig } from "../../Browser/Browser/domain/BrowserConfig";

export class LeagueConfig {
  readonly name: StringValueObject;
  constructor(_name: string, readonly config: BrowserConfig) {
    this.name = new StringValueObject(_name);
  }
}
