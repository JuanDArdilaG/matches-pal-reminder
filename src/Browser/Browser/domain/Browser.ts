import { StringValueObject } from "@juandardilag/value-objects";
import { BrowserConfig } from "./BrowserConfig";
import { Match } from "../../../Matches/domain/Match";
import { Page } from "../../Page/domain/Page";
import { ScrapperResult } from "../../../Scrapper/domain/ScrapperResult";
import { MatchDate } from "../../../Matches/domain/MatchDate";
import { BrowserCache } from "./BrowserCache";

export interface Browser {
  get delay(): number;
  set delay(value: number);
}
