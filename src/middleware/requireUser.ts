import { Request, Response, NextFunction } from "express";
import errorObject from "../utils/errorObject";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;

  if (!user) {
    return res.status(200).send(errorObject(403, "not logged in"));
  }

  return next();
};

export default requireUser;
