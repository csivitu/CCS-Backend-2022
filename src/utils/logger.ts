import winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";
import config from "config";

const loggingWinston = new LoggingWinston({ prefix: "general" });
const testLoggingWinston = new LoggingWinston({ prefix: "quiz" });

const logger = winston.createLogger({
  level: "info",
  defaultMeta: "general-log",
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.errors({ stack: true })
  ),

  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.simple(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true })
      ),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.simple(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true })
      ),
    }),
    loggingWinston,
  ],
});

export const testLogger = winston.createLogger({
  level: "info",
  defaultMeta: "start/end",
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.errors({ stack: true })
  ),

  transports: [
    new winston.transports.File({
      filename: "logs/test_error.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.simple(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true })
      ),
    }),
    new winston.transports.File({
      filename: "logs/test_combined.log",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.simple(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true })
      ),
    }),
    testLoggingWinston,
  ],
});

if (config.get<string>("enviornment") !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
  testLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
