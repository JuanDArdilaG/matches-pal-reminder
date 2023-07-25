import { Criteria } from "./Criteria";

export class Filter<T extends Object> {
  run(items: T[], criteria: Criteria<T>): T[] {
    return items.filter((item) => criteria.meet(item));
  }
}
