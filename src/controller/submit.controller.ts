import { Request, Response } from "express";
import { SubmitInput } from "../schema/submit.schema";
import { getCcsUserByUsername } from "../service/ccsUser.service";
import errorObject from "../utils/errorObject";
import logger from "../utils/logger";

export default async function submitHandler(
  req: Request<Record<string, never>, Record<string, never>, SubmitInput>,
  res: Response
) {
  try {
    const decodedUser = res.locals.user;

    const { finalSubmit, domain, questions } = req.body;

    const user = await getCcsUserByUsername(decodedUser.username);
    if (!user) {
      return res.status(404).send(errorObject(404, "user not found"));
    }

    switch (domain) {
      case "Tech":
        user.techAttempted = questions;
        break;
      case "Management":
        user.managementAttempted = questions;
        break;
      case "Design":
        user.designAttempted = questions;
        break;
      case "Video":
        user.videoAttempted = questions;
        break;
      default:
        break;
    }

    if (finalSubmit) {
      user.startTime = null;
      user.endTime = null;
    }

    user.save();

    logger.info({ username: user.username, message: "autosaved" });
    return res.send(errorObject(200, "autosaved"));
  } catch (e) {
    logger.error(e);
    return res.status(500).send(errorObject(500, e));
  }
}
