import { Express, Request, Response } from "express";
import {
  addUserInfoHandler,
  addUserTaskHandler,
  createUserHandler,
  forgotPasswordHandler,
  getUserHandler,
  getUserTaskHandler,
  resendEmailHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "./controller/user.controller";
import createUserSessionHandler from "./controller/session.controller";
import startHandler from "./controller/start.controller";
import validateResource from "./middleware/validateResource";
import {
  AddUserInfoSchema,
  AddUserTaskSchema,
  createUserSchema,
  emailVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./schema/user.schema";
import { createSessionSchema } from "./schema/session.schema";
import { startSchema } from "./schema/start.schema";
import requireUser from "./middleware/requireUser";
import { submitSchema } from "./schema/submit.schema";
import submitHandler from "./controller/submit.controller";
import requireTime from "./middleware/requireTime";
import {
  getUserInfoHandler,
  getUsersHandler,
} from "./controller/admin.controller";
import questionHandler from "./controller/question.controller";
import {
  apiLimiter,
  createAccountLimiter,
  emailVerifyLimiter,
  forgotPasswordLimiter,
} from "./utils/limiters";
import { resendEmailSchema } from "./schema/resendEmail.schema";
import requireTaskTime from "./middleware/requireTaskTime";
import requireAdmin from "./middleware/requireAdmin";
import { AdminGetUserSchema } from "./schema/adminPost.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  // app.use(adminjs.options.rootPath, adminRouter);

  app.post(
    "/api/users",
    validateResource(createUserSchema),
    createAccountLimiter,
    createUserHandler
  );

  app.post(
    "/api/sessions",
    apiLimiter,
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get(
    "/api/users/verify/:token/:user",
    apiLimiter,
    validateResource(emailVerifySchema),
    verifyEmailHandler
  );

  app.post(
    "/api/users/forgotPassword",
    forgotPasswordLimiter,
    validateResource(forgotPasswordSchema),
    forgotPasswordHandler
  );

  app.post(
    "/api/users/resetPassword/:id/:passwordResetCode",
    apiLimiter,
    validateResource(resetPasswordSchema),
    resetPasswordHandler
  );

  app.post(
    "/api/start",
    apiLimiter,
    requireUser,
    validateResource(startSchema),
    startHandler
  );

  app.post(
    "/api/submit",
    apiLimiter,
    requireUser,
    requireTime,
    validateResource(submitSchema),
    submitHandler
  );

  app.get("/api/admin", apiLimiter, requireAdmin, getUsersHandler);
  app.get(
    "/api/admin/:username",
    apiLimiter,
    validateResource(AdminGetUserSchema),
    requireAdmin,
    getUserInfoHandler
  );

  // app.post(
  //   "/api/admin",
  //   apiLimiter,
  //   requireAdmin,
  //   validateResource(adminPostSchema),
  //   updateCcsUserHandler
  // );

  app.post(
    "/api/questions",
    apiLimiter,
    requireUser,
    requireTime,
    validateResource(startSchema),
    questionHandler
  );

  app.get(
    "/api/resendEmailVerificaton",
    emailVerifyLimiter,
    validateResource(resendEmailSchema),
    resendEmailHandler
  );

  app.get("/api/getUser", apiLimiter, requireUser, getUserHandler);

  app.put(
    "/api/users/info",
    apiLimiter,
    validateResource(AddUserInfoSchema),
    requireUser,
    addUserInfoHandler
  );

  app.put(
    "api/users/task",
    apiLimiter,
    validateResource(AddUserTaskSchema),
    requireUser,
    requireTaskTime,
    addUserTaskHandler
  );

  app.get("api/users/task", apiLimiter, requireUser, getUserTaskHandler);
}

export default routes;
