import express from "express";
import config from "config";
// import hbs from "express-handlebars";
// import path from "path";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const port = config.get<number>("port");

const app = express();
// const templateFolder = path.join(__dirname, "templates");

app.use(express.json());
app.use(deserializeUser);
// app.set("views", path.join(__dirname, "templates"));

// app.engine(
//   "html",
//   hbs.engine({
//     extname: ".html",
//     layoutsDir: templateFolder,
//   })
// );

// app.set("view engine", "html");

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connect();
  routes(app);
});
