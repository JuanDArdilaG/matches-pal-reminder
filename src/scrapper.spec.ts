import { Browser } from "./browser";
import { Scrapper } from "./scrapper";

describe("Scrapper", () => {
  let scrapper: Scrapper;

  beforeEach(() => {
    const browser = new Browser({ url: "", delay: 0, rootSelector: "" });
    scrapper = new Scrapper(browser);
  });

  test("run() should return a promise", () => {
    expect(scrapper.run()).toBeInstanceOf(Promise);
  });

  test("run() promise should resolve to an array", async () => {
    const result = await scrapper.run();
    expect(Array.isArray(result)).toBe(true);
  });

  test("run() should resolve to an array of Partido objects", async () => {
    const result = await scrapper.run();
    result.forEach((item) => {
      // Aquí debes verificar si cada objeto en el array cumple con la estructura de un objeto 'Partido'.
      // Esto dependerá de cómo hayas definido la clase/estructura 'Partido'.
      expect(item).toHaveProperty("nombrePropiedad1");
      expect(item).toHaveProperty("nombrePropiedad2");
      // Continúa con el resto de las propiedades que debe tener un objeto 'Partido'.
    });
  });
});
