import { Request, Response } from "express";
import moment from "moment";
import { StartInput } from "../schema/start.schema";
import {
  createCcsUser,
  getCcsUserByUsername,
} from "../service/ccsUser.service";
import logger from "../utils/logger";

export default async function startHandler(
  req: Request<Record<string, never>, Record<string, never>, StartInput>,
  res: Response
) {
  const user = await getCcsUserByUsername(res.locals.user.username);
  const { domain } = req.body;
  const start: Date = new Date();
  const end: Date = moment(start).add(process.env.DURATION, "m").toDate();
  try {
    if (!user) {
      const newUser = await createCcsUser(
        res.locals.user.username as string,
        res.locals.user._id,
        domain,
        start,
        end
      );
      logger.info({
        username: newUser.username,
        message: "User created in ccs DB",
      });
    } else {
      if (user.domainsAttempted.includes(domain)) {
        // console.log("in")
        // logger.warn(logical_errors.L2, { username: username });
        return res.status(403).send("Domain already attempted");
      }
      user.domainsAttempted.push(domain);
      user.startTime = start;
      user.endTime = end;
      user.questionLoaded = null;
      user.save();
      logger.info({
        username: user.username,
        message: `Started domain ${domain}`,
      });
    }
    return res.send(`succesfully started domain ${domain}`);
  } catch (error: unknown) {
    logger.error({ username: res.locals.user.username, error });
    return res.status(500).send(error);
  }
}
