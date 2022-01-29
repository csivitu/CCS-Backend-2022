import { Request, Response } from "express";
import config from "config";
import { omit } from "lodash";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import { SessionInput } from "../schema/session.schema";
import errorObject from "../utils/errorObject";
import logger from "../utils/logger";
import standardizeObject from "../utils/standardizeObject";

export default async function createUserSessionHandler(
  req: Request,
  res: Response
) {
  try {
    // Validate the user's password
    const user = await validatePassword(req.body as SessionInput);

    if (!user) {
      return res
        .status(401)
        .send(errorObject(401, "Invalid email or password"));
    }

    if (!user.verificationStatus) {
      return res.status(401).send(errorObject(401, "Email not verified"));
    }

    // create an access token

    const accessToken = signJwt(
      omit(user, "verificationStatus"),
      "accessTokenPrivateKey",
      { expiresIn: config.get("accessTokenTtl") }
    );
    // create a refresh token
    const refreshToken = signJwt(user, "refreshTokenPrivateKey", {
      expiresIn: config.get("refreshTokenTtl"),
    });

    // return access & refresh tokens

    return res.send(
      errorObject(200, "Successfully logged in", { accessToken, refreshToken })
    );
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, standardizeObject(e)));
  }
}
