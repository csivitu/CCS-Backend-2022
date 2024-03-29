import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import reIssueAccessToken from "../service/session.service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = <string>get(req, "headers.x-refresh");

  if (!accessToken && !refreshToken) {
    return next();
  }

  if (accessToken) {
    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
      res.locals.user = decoded;
      return next();
    }
  }

  if (refreshToken) {
    const newAccessToken = await reIssueAccessToken(refreshToken);

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    const newDecoded = verifyJwt(
      newAccessToken as string,
      "accessTokenPublicKey"
    );

    res.locals.user = newDecoded;
    return next();
  }

  return next();
};

export default deserializeUser;
