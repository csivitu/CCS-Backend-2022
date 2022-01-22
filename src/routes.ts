import { Express, Request, Response } from "express";
// import config from "config";
// import url from "url";
import {
  createUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "./controller/user.controller";
import createUserSessionHandler from "./controller/session.controller";
import startHandler from "./controller/start.controller";
import validateResource from "./middleware/validateResource";
import {
  createUserSchema,
  emailVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./schema/user.schema";
import { createSessionSchema } from "./schema/session.schema";
import { startSchema } from "./schema/start.schema";
import requireUser from "./middleware/requireUser";
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

  app.post(
    "/api/users/verify/:id/:token",
    validateResource(emailVerifySchema),
    verifyEmailHandler
  );

  app.post(
    "/api/users/forgotPassword",
    validateResource(forgotPasswordSchema),
    forgotPasswordHandler
  );

  app.post(
    "/api/users/resetPassword/:id/:passwordResetCode",
    validateResource(resetPasswordSchema),
    resetPasswordHandler
  );

  app.post("/start", requireUser, validateResource(startSchema), startHandler);
}

export default routes;
