import { ChalkFormatter, Color, ConsoleLogger } from "@juandardilag/logger";
import { StringValueObject } from "@juandardilag/value-objects";

export const Logger = new ConsoleLogger(
  new ChalkFormatter(),
  new StringValueObject("logger"),
  Color.fromString("black"),
  true
);
