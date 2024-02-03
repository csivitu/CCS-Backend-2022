import { Request, Response, NextFunction } from "express";
import config from "config";
import errorObject from "../utils/errorObject";
import ccsUserModel from "../models/ccsUser.model";
import { AddUserTaskInput } from "../schema/user.schema";

const requireTaskTime = async (
  req: Request<Record<string, never>, Record<string, never>, AddUserTaskInput>,
  res: Response,
  next: NextFunction
) => {
  const { user } = res.locals;

  if (!user) {
    return res.status(200).send(errorObject(403, "not logged in"));
  }

  if (new Date() > new Date(config.get<string>("task_submission_date"))) {
    return res.status(200).send(errorObject(403, "submission date exceeded"));
  }
  if (new Date() < new Date(config.get<string>("task_start_date"))) {
    return res
      .status(200)
      .send(errorObject(403, "submissions not yet started"));
  }

  const dbUser = await ccsUserModel.findOne({ username: user.username });
  console.log(req.body.subdomain);
  return next();
};

export default requireTaskTime;
