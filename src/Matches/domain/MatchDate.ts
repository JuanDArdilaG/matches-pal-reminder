import { DateValueObject } from "@juandardilag/value-objects";

export class MatchDate extends DateValueObject {
  static now(): MatchDate {
    return new MatchDate(Date.now());
  }

  static fromSpanishTextualDate(textualDate: string): Date {
    const components = textualDate.split(" ");
    components.shift(); // Removemos el día de la semana ("Saturday")

    const spanishMonths = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const englishMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = spanishMonths.indexOf(components[1].toLowerCase());
    if (monthIndex !== -1) {
      components[1] = englishMonths[monthIndex];
    }

    // Creamos la nueva cadena de fecha sin el día de la semana
    const dateString = components.join(" ");
    const date = new Date(dateString);
    return date;
  }

  get dateString(): string {
    return this.value.toISOString().split("T")[0];
  }

  get timeString(): string {
    return this.value.toISOString().split("T")[1].split("-")[0].split(".")[0];
  }

  toUTC(): Date {
    let adjustedDate;

    if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(this.timeString)) {
      let dateLocal = new Date(`${this.dateString}T${this.timeString}`);
      let localTimeInMilliseconds = dateLocal.getTime();
      adjustedDate = new Date(localTimeInMilliseconds);
    } else {
      adjustedDate = new Date(`${this.dateString}T07:00:00`);
    }

    return adjustedDate;
  }

  toUTC5() {
    let adjustedDate;

    if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(this.timeString)) {
      let dateInUTC = new Date(`${this.dateString}T${this.timeString}Z`);
      let utcTimeInMilliseconds = dateInUTC.getTime() - 5 * 60 * 60 * 1000;
      adjustedDate = new Date(utcTimeInMilliseconds);
    } else {
      adjustedDate = new Date(`${this.dateString}T07:00:00`);
    }

    return new MatchDate(adjustedDate);
  }

  equalDates(other: MatchDate): boolean {
    return (
      this.value.toISOString().split("T")[0] ===
      other.value.toISOString().split("T")[0]
    );
  }

  checkValidDate(): boolean {
    return isNaN(this.value.getTime());
  }
}
