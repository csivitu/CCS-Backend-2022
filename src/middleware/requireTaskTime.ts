import { Request, Response, NextFunction } from "express";
import config from "config";
import errorObject from "../utils/errorObject";
import ccsUserModel from "../models/ccsUser.model";
import { AddUserTaskInput } from "../schema/user.schema";
import { designSubdomains, techSubdomains } from "../types/subdomainTypes";

const requireTaskTime = async (
  req: Request<Record<string, never>, Record<string, never>, AddUserTaskInput>,
  res: Response,
  next: NextFunction
) => {
  const { user } = res.locals;

  if (!user) {
    return res.status(200).send(errorObject(403, "not logged in"));
  }

  if (new Date() <= new Date(config.get<string>("taskSubmissionDate"))) {
    return res.status(200).send(errorObject(403, "submission date exceeded"));
  }

  const dbUser = await ccsUserModel.findOne({ _id: user._id });

  if (
    (dbUser.techRound >= 2 && techSubdomains.includes(req.body.subdomain)) ||
    (dbUser.designRound >= 2 && designSubdomains.includes(req.body.subdomain))
  ) {
    return res
      .status(200)
      .send(errorObject(403, "Not allowed to submit task for that domain"));
  }

  return next();
};

export default requireTaskTime;
