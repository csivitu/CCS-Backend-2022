import { Request, Response, NextFunction } from "express";
import { checkTime } from "../service/ccsUser.service";

const requireTime = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;

  if (!user) {
    return res.sendStatus(403);
  }
  checkTime(user.username);

  return next();
};

export default requireTime;
