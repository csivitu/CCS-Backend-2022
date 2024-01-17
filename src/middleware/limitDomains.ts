import { Request, Response, NextFunction } from "express";
import { getCcsUserDomains } from "../service/ccsUser.service";
import errorObject from "../utils/errorObject";

const limitDomains = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = res.locals;

  if (!user) {
    return res.status(200).send(errorObject(403, "not logged in"));
  }
  const userInfo = await getCcsUserDomains(user._id);
  if (userInfo.domainsAttempted.length >= 2) {
    return res
      .status(200)
      .send(errorObject(403, "2 domain quizes already filled"));
  }

  return next();
};

export default limitDomains;
