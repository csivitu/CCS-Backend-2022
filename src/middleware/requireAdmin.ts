import { Request, Response, NextFunction } from "express";
import { findUserById } from "../service/user.service";

const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = res.locals;

  if (!user) {
    return res.sendStatus(403);
  }
  const userInfo = await findUserById(user._id);
  if (!userInfo.scope.includes("admin")) {
    return res.sendStatus(403);
  }

  return next();
};

export default requireAdmin;
