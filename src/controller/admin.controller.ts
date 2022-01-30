import { Request, Response } from "express";
import AdminJS from "adminjs";
import AdminJSMongoose from "@adminjs/mongoose";
import AdminJSExpress from "@adminjs/express";
import { AdminPostInput } from "../schema/adminPost.schema";
import { getAllUsers, getCcsUserByUsername } from "../service/ccsUser.service";
import errorObject from "../utils/errorObject";
import logger from "../utils/logger";
import standardizeObject from "../utils/standardizeObject";
import ccsUserModel from "../models/ccsUser.model";
import QuestionModel from "../models/question.model";
import UserModel from "../models/user.model";

AdminJS.registerAdapter(AdminJSMongoose);

const adminJsOptions = {
  resources: [ccsUserModel, QuestionModel, UserModel],
  rootPath: "/admin",
};

const creds = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASS,
};

export const adminjs = new AdminJS(adminJsOptions);
export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminjs, {
  cookieName: process.env.ADMIN_COOKIE_NAME || "fridayaapancho",
  cookiePassword: process.env.ADMIN_COOKIE_PASS || "fudiyanfado",
  authenticate: async (email, password) => {
    if (email === creds.email && password === creds.password) {
      return creds;
    }
    return null;
  },
});

export async function getUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.send(errorObject(200, "", users));
  } catch (e) {
    logger.error(e);
    return res.status(404).send(errorObject(404, e));
  }
}
export async function changeRoundHandler(
  req: Request<Record<string, never>, Record<string, never>, AdminPostInput>,
  res: Response
) {
  try {
    const user = await getCcsUserByUsername(req.body.username);
    switch (req.body.domain) {
      case "Tech":
        user.techRound = req.body.round;
        break;
      case "Management":
        user.managementRound = req.body.round;
        break;
      case "Design":
        user.designRound = req.body.round;
        break;
      case "Video":
        user.videoRound = req.body.round;
        break;
      default:
        break;
    }
    user.save();
    return res.send(errorObject(200, "user round successfully saved"));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(404).send(errorObject(404, standardizeObject(e)));
  }
}
