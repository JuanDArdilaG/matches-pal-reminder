import { Criteria } from "./Criteria";

export class And<T extends Object> {
  constructor(private criterias: Criteria<T>[]) {}

  meet(item: T): boolean {
    return this.criterias.every((criteria) => criteria.meet(item));
  }
}
