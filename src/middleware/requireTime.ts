import { Request, Response, NextFunction } from "express";
import { checkTime } from "../service/ccsUser.service";

const requireTime = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;

  if (!user) {
    return res.sendStatus(403);
  }

  const valid = await checkTime(user.username);
  if (valid !== true) {
    return res.status(403).send(valid);
  }

  return next();
};

export default requireTime;
