import { ElementHandle } from "puppeteer";
import { PageElement } from "../domain/PageElement";

export class PuppeteerPageElement implements PageElement {
  constructor(private _element: ElementHandle<Element>) {}
}
