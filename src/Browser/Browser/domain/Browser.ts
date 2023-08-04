import { ScrapperResult } from "../../../Scrapper/domain/ScrapperResult";
import { BrowserCache } from "./BrowserCache";

export interface Browser {
  get delay(): number;
  set delay(value: number);
  get cache(): BrowserCache;
  set cache(value: BrowserCache);
  scrape(): Promise<ScrapperResult>;
  close(): Promise<void>;
}
