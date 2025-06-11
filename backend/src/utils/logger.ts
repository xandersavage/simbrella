// Logger utility for consistent logging across the application

import winston from "winston";

const transports = [];

// 1. Console Transport: Logs to the console
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.cli(),
      winston.format.splat()
    ),
  })
);

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Create the Winston logger instance
const logger = winston.createLogger({
  levels: levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    // Define a custom format for how the log message is displayed
    winston.format.printf((info) => {
      // If the log message has an error object, serialize it
      if (info.stack) {
        return `${info.timestamp} ${info.level}: ${info.message} - ${info.stack}`;
      }
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
  transports: transports, // Use the defined transports
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
});

// Export the logger object with specific level methods
export const log = {
  error: (message: string, ...args: any[]) => logger.error(message, ...args),
  warn: (message: string, ...args: any[]) => logger.warn(message, ...args),
  info: (message: string, ...args: any[]) => logger.info(message, ...args),
  debug: (message: string, ...args: any[]) => logger.debug(message, ...args),
};
