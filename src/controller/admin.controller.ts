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
import TaskModel from "../models/task.model";

AdminJS.registerAdapter(AdminJSMongoose);

const adminJsOptions = {
  resources: [ccsUserModel, QuestionModel, UserModel, TaskModel],
  rootPath: "/admin",
};

const creds = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASS,
};

export const adminjs = new AdminJS(adminJsOptions);
export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminjs,
  {
    cookieName: process.env.ADMIN_COOKIE_NAME || "fridayaapancho",
    cookiePassword: process.env.ADMIN_COOKIE_PASS || "fudiyanfado",
    authenticate: async (email, password) => {
      if (email === creds.email && password === creds.password) {
        return creds;
      }
      return null;
    },
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);

export async function getUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).send(errorObject(200, "", users));
  } catch (e) {
    logger.error(e);
    return res.status(500).send(errorObject(500, e));
  }
}
export async function updateCcsUserHandler(
  req: Request<Record<string, never>, Record<string, never>, AdminPostInput>,
  res: Response
) {
  try {
    const user = await getCcsUserByUsername(req.body.username);
    switch (req.body.domain) {
      case "Tech":
        if (req.body.round) {
          user.techRound = req.body.round;
        }
        if (req.body.comment) {
          user.comments.tech.push(req.body.comment);
        }
        if (req.body.mark) {
          user.marks.tech = req.body.mark;
        }
        break;
      case "Management":
        if (req.body.round) {
          user.managementRound = req.body.round;
        }
        if (req.body.comment) {
          user.comments.management.push(req.body.comment);
        }
        if (req.body.mark) {
          user.marks.management = req.body.mark;
        }
        break;
      case "Design":
        if (req.body.round) {
          user.designRound = req.body.round;
        }
        if (req.body.comment) {
          user.comments.design.push(req.body.comment);
        }
        if (req.body.mark) {
          user.marks.design = req.body.mark;
        }
        break;
      case "Video":
        if (req.body.round) {
          user.videoRound = req.body.round;
        }
        if (req.body.comment) {
          user.comments.video.push(req.body.comment);
        }
        if (req.body.mark) {
          user.marks.video = req.body.mark;
        }
        break;
      default:
        break;
    }
    user.save();
    return res
      .status(200)
      .send(errorObject(200, "user round successfully saved"));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, standardizeObject(e)));
  }
}
