import { Express, Request, Response } from "express";
// import config from "config";
// import url from "url";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
} from "./controller/session.controller";
import validateResource from "./middleware/validateResource";
import createUserSchema from "./schema/user.schema";
import { createSessionSchema } from "./schema/session.schema";
// import sendMail from "./tools/sendMail";
// import constants from "./tools/constants";
// import { UserDocument } from "./models/user.model";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);
  app.delete("/api/sessions", requireUser, deleteSessionHandler);
}

export default routes;
