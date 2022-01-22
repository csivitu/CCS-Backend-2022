import { Request, Response } from "express";
import { SubmitInput } from "../schema/submit.schema";
import { checkTime, getCcsUserByUsername } from "../service/ccsUser.service";
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
      return res.status(404).send("user not found");
    }
    checkTime(user);

    // user.ques.quesId = ques.quesId
    // user.domainsAttempted.push(domainsAttempted)

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
      default:
        break;
    }

    if (finalSubmit) {
      user.startTime = null;
      user.endTime = null;
    }

    user.save();

    logger.info({ username: user.username, message: "autosaved" });
    return res.send("autosaved");
  } catch (e: unknown) {
    logger.error(e);
    return res.status(500).send(e);
  }
}
