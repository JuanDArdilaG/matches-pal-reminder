import { Criteria } from "./Criteria";

export class Or<T extends Object> implements Criteria<T> {
  constructor(private criterias: Criteria<T>[]) {}

  meet(item: T): boolean {
    return this.criterias.some((criteria) => criteria.meet(item));
  }
}
