import { Express, Request, Response } from "express";
import {
  createUserHandler,
  forgotPasswordHandler,
  getUserHandler,
  resendEmailHandler,
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
import { submitSchema } from "./schema/submit.schema";
import submitHandler from "./controller/submit.controller";
import requireTime from "./middleware/requireTime";
import requireAdmin from "./middleware/requireAdmin";
import {
  adminjs,
  adminRouter,
  changeRoundHandler,
  getUsersHandler,
} from "./controller/admin.controller";
import { adminPostSchema } from "./schema/adminPost.schema";
import questionHandler from "./controller/question.controller";
import {
  apiLimiter,
  createAccountLimiter,
  emailVerifyLimiter,
  forgotPasswordLimiter,
} from "./utils/limiters";
import { resendEmailSchema } from "./schema/resendEmail.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
  app.use(adminjs.options.rootPath, adminRouter);
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

  app.post(
    "/api/admin",
    apiLimiter,
    requireAdmin,
    validateResource(adminPostSchema),
    changeRoundHandler
  );

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
}

export default routes;
