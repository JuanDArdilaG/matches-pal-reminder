import { StringValueObject } from "@juandardilag/value-objects";
import { BrowserConfig } from "../../Browser/Browser/domain/BrowserConfig";

export class LeagueConfig {
  constructor(
    readonly code: StringValueObject,
    readonly name: StringValueObject,
    readonly browserConfig: BrowserConfig
  ) {}

  static fromCodeAndName(
    code: string,
    name: string,
    browserConfig: BrowserConfig
  ): LeagueConfig {
    return new LeagueConfig(
      new StringValueObject(name),
      new StringValueObject(code),
      browserConfig
    );
  }
}
