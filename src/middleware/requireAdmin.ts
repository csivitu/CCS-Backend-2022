import { Request, Response, NextFunction } from "express";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { user } = res.locals;

  if (!user) {
    return res.sendStatus(403);
  }
  if (!user.scopes?.includes("admin")) {
    return res.sendStatus(403);
  }

  return next();
};

export default requireAdmin;
