import { Express, Request, Response } from "express";
// import hbs from "express-handlebars";
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

// const hb = hbs.create({
//   extname: ".hbs",
// });
// export const sendVerificationMail = async (participant: UserDocument) => {
//   const verifyLink = new url.URL(config.get("verify_link"));
//   verifyLink.searchParams.append("token", participant.emailVerificationToken);
//   const renderedHtml = await hb.render("src/templates/verify.hbs", {
//     name: participant.name,
//     verifyLink: verifyLink.href,
//   });
//   await sendMail(
//     participant.email,
//     constants.sendVerificationMailSubject,
//     renderedHtml
//   );
// };

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
