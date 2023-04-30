import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "debug",
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: {
    // service: "socket-io-service"
  },
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
} else {
  //
  // - Write all logs with importance level of `error` or less to `error.log`
  // - Write all logs with importance level of `info` or less to `combined.log`
  //
  logger.add(new transports.File({ filename: "error.log", level: "error" }));
  logger.add(new transports.File({ filename: "combined.log", level: "info" }));
}
