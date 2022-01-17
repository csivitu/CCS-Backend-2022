import pino from "pino";
import dayjs from "dayjs";

// const log = logger({
// //   prettyPrint: true,
//   base: {
//     pid: false,
//   },
//   timestamp: () => `,"time":"${dayjs().format()}"`,
// });

const logger = pino(
  {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
  },
  pino.destination(`${__dirname}/logger.log`)
);

export default logger;
