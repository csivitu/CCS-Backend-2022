import config from "config";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";

export default async function reIssueAccessToken(refreshToken: string) {
  const decoded = verifyJwt<{ _id: string }>(
    refreshToken,
    "refreshTokenPublicKey"
  );
  if (!decoded) return false;

  const userFromDB = await findUser({ _id: decoded._id });

  if (!userFromDB) return false;

  const accessToken = signJwt(
    userFromDB,
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  return accessToken;
}
