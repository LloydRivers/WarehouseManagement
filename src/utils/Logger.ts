/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ILogger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
}

export class ConsoleLogger implements ILogger {
  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const color = this.getColor(level);
    const divider =
      "\n────────────────────────────────────────────────────────\n";

    return `${divider}${color}[${timestamp}] [${level.padEnd(
      7
    )}] ${message}\x1b[0m${data ? `\n${JSON.stringify(data, null, 2)}` : ""}\n`;
  }

  private getColor(level: string): string {
    switch (level) {
      case "DEBUG":
        return "\x1b[36m"; // Cyan
      case "INFO":
        return "\x1b[32m"; // Green
      case "WARNING":
        return "\x1b[33m"; // Yellow
      case "ERROR":
        return "\x1b[31m"; // Red
      default:
        return "\x1b[0m"; // Reset
    }
  }

  debug(message: string, data?: any): void {
    console.debug(this.formatMessage("DEBUG", message, data));
  }

  info(message: string, data?: any): void {
    console.info(this.formatMessage("INFO", message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage("WARNING", message, data));
  }

  error(message: string, data?: any): void {
    console.error(this.formatMessage("ERROR", message, data));
  }
}
