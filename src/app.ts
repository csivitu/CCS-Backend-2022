import express from "express";
import config from "config";
import cors from "cors";
import cluster from "cluster";
import os from "os";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const cpus = config.get("enviornment") === "production" ? os.cpus().length : 2;

const port = config.get<number>("port");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(deserializeUser);

if (cluster.isPrimary) {
  for (let i = 0; i < cpus; i += 1) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      logger.error(
        `Worker ${worker.id} crashed due to ${signal}. `,
        "Starting a new worker..."
      );
      cluster.fork();
    }
  });
} else {
  app.listen(port, async () => {
    logger.info(
      `App is running at http://localhost:${port} with pid: ${process.pid}`
    );
    await connect();
    routes(app);
  });
}
