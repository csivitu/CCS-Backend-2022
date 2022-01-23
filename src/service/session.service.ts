import config from "config";
import { omit } from "lodash";
import { privateFields } from "../models/user.model";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";

export default async function reIssueAccessToken(refreshToken: string) {
  const decoded = verifyJwt<{ _id: string }>(
    refreshToken,
    "refreshTokenPublicKey"
  );
  if (!decoded) return false;

  const userFromDB = await findUser({ _id: decoded._id });
  const user = omit(userFromDB.toJSON(), privateFields);

  if (!userFromDB) return false;

  const accessToken = signJwt(user, "accessTokenPrivateKey", {
    expiresIn: config.get("accessTokenTtl"),
  });

  return accessToken;
}
