import { convertFromUTC, convertToUTC } from "./dates";

describe("convertFromUTC", () => {
  it("should convert UTC date and time to local date and time in UTC-5", () => {
    const utcDateString = "2023-03-28";
    const utcTimeString = "18:00:00";

    const date = convertFromUTC(utcDateString, utcTimeString);

    expect(date.toISOString().split("T")[0]).toBe("2023-03-28");
    expect(date.toISOString().split("T")[1].split("-")[0].split(".")[0]).toBe(
      "13:00:00"
    );
  });

  it("should convert UTC date and time to local date and time in UTC-5", () => {
    const utcDateString = "2023-03-28";
    const utcTimeString = "12:00:00";

    const date = convertFromUTC(utcDateString, utcTimeString);

    expect(date.toISOString().split("T")[0]).toBe("2023-03-28");
    expect(date.toISOString().split("T")[1].split("-")[0].split(".")[0]).toBe(
      "07:00:00"
    );
  });

  it("should convert UTC date and time to local date and time in UTC-5 (evening)", () => {
    const localDateString = "2023-03-28";
    const localTimeString = "20:00:00";

    const date = convertFromUTC(localDateString, localTimeString);

    expect(date.toISOString().split("T")[0]).toBe("2023-03-28");
    expect(date.toISOString().split("T")[1].split("-")[0].split(".")[0]).toBe(
      "15:00:00"
    );
  });

  it("should convert UTC date and time with invalid time to local date and time in UTC-5", () => {
    const utcDateString = "2023-03-28";
    const utcTimeString = "invalid";

    const date = convertFromUTC(utcDateString, utcTimeString);

    expect(date.toISOString().split("T")[0]).toBe("2023-03-28");
    expect(date.toISOString().split("T")[1].split("-")[0].split(".")[0]).toBe(
      "12:00:00"
    );
  });
});

describe("convertToUTC", () => {
  it("should convert local date and time in UTC-5 to UTC date and time (morning)", () => {
    const localDateString = "2023-03-28";
    const localTimeString = "08:00:00";

    const date = convertToUTC(localDateString, localTimeString);

    expect(date.toISOString().split("T")[0]).toBe("2023-03-28");
    expect(date.toISOString().split("T")[1].split("-")[0].split(".")[0]).toBe(
      "13:00:00"
    );
  });

  it("should convert local date and time in UTC-5 to UTC date and time (evening)", () => {
    const localDateString = "2023-03-28";
    const localTimeString = "20:00:00";

    const date = convertToUTC(localDateString, localTimeString);

    expect(date.toISOString().split("T")[0]).toBe("2023-03-29");
    expect(date.toISOString().split("T")[1].split("-")[0].split(".")[0]).toBe(
      "01:00:00"
    );
  });

  it("should handle invalid time input and set to midnight UTC", () => {
    const localDateString = "2023-03-28";
    const localTimeString = "invalid";

    const date = convertToUTC(localDateString, localTimeString);

    expect(date.toISOString().split("T")[0]).toBe("2023-03-28");
    expect(date.toISOString().split("T")[1].split("-")[0].split(".")[0]).toBe(
      "12:00:00"
    );
  });
});
