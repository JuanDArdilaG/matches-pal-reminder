export interface Criteria<T extends Object> {
  meet(item: T): boolean;
}
