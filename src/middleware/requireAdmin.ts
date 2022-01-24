import { Request, Response, NextFunction } from "express";
import { findUserById } from "../service/user.service";
import errorObject from "../utils/errorObject";

const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = res.locals;

  if (!user) {
    return res.status(403).send(errorObject(403, "not logged in"));
  }
  const userInfo = await findUserById(user._id);
  if (!userInfo.scope.includes("admin")) {
    return res.status(403).send(errorObject(403, "not allowed"));
  }

  return next();
};

export default requireAdmin;
