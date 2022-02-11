import { Request, Response, NextFunction } from "express";
import config from "config";
import { checkTime } from "../service/ccsUser.service";
import errorObject from "../utils/errorObject";

const requireTime = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;

  if (!user) {
    return res.status(200).send(errorObject(403, "not logged in"));
  }

  if (new Date() > new Date(config.get("task_start_date"))) {
    return res
      .status(200)
      .send(errorObject(403, "https://www.youtube.com/watch?v=dQw4w9WgXcQ"));
  }

  const valid = await checkTime(user.username);
  if (valid !== true) {
    return res.status(200).send(errorObject(403, valid));
  }

  return next();
};

export default requireTime;
