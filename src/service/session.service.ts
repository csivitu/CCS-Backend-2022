import { get } from "lodash";
import config from "config";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";

export default async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey");
  const user = get(decoded, "user");
  if (!decoded || !user) return false;

  const userFromDB = await findUser({ _id: user._id });

  if (!userFromDB) return false;

  const accessToken = signJwt(
    { userFromDB },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  return accessToken;
}
