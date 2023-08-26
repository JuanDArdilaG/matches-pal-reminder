export class Environment {
  static get env(): string {
    return process.env.NODE_ENV || "development";
  }

  static get isProduction(): boolean {
    return this.env === "production";
  }

  static get isDevelopment(): boolean {
    return this.env === "development";
  }

  static get isTest(): boolean {
    return this.env === "test";
  }

  static get chromePath(): string | undefined {
    return this.isDevelopment
      ? process.env.CHROME_PATH_MACOS
      : process.env.CHROME_PATH_DOCKER;
  }
}
