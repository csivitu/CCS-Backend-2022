import winston from "winston";
import config from "config";

const logger = winston.createLogger({
  level: "info",
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
  ],
});

if (config.get<string>("enviornment") !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
