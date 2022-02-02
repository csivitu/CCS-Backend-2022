import { Request, Response } from "express";
import moment from "moment";
import config from "config";
import { StartInput } from "../schema/start.schema";
import {
  createCcsUser,
  getCcsUserByUsername,
} from "../service/ccsUser.service";
import logger, { testLogger } from "../utils/logger";
import errorObject from "../utils/errorObject";
import standardizeObject from "../utils/standardizeObject";

export default async function startHandler(
  req: Request<Record<string, never>, Record<string, never>, StartInput>,
  res: Response
) {
  const user = await getCcsUserByUsername(res.locals.user.username);
  const { domain } = req.body;
  const start: Date = new Date();
  const end: Date = moment(start)
    .add(config.get<number>("test_duration"), "m")
    .toDate();
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
      if (user.domainsAttempted.map((obj) => obj.domain).includes(domain)) {
        return user.domainsAttempted[
          user.domainsAttempted.map((obj) => obj.domain).indexOf(domain)
        ].endTime >= new Date()
          ? res.status(200).send(errorObject(200, "Domain already started"))
          : res.status(200).send(errorObject(403, "Domain already attempted"));
      }

      if (
        user.domainsAttempted.length > 0 &&
        user.domainsAttempted[user.domainsAttempted.length - 1].endTime &&
        user.domainsAttempted[user.domainsAttempted.length - 1].endTime >=
          new Date()
      ) {
        return res.status(200).send(
          errorObject(
            403,
            `User already attempting ${
              user.domainsAttempted[user.domainsAttempted.length - 1].domain
            }`,
            {
              domain:
                user.domainsAttempted[user.domainsAttempted.length - 1].domain,
            }
          )
        );
      }
      user.domainsAttempted.push({ domain, endTime: end });
      user.startTime = start;
      user.endTime = end;
      user.questionLoaded = null;
      await user.save();
      logger.info({
        username: user.username,
        message: `Started domain ${domain}`,
      });
      testLogger.info({
        username: user.username,
        message: `Started domain ${domain} at ${start}`,
      });
    }
    return res
      .status(200)
      .send(errorObject(200, `succesfully started domain ${domain}`));
  } catch (e) {
    logger.error({
      username: res.locals.user.username,
      error: standardizeObject(e),
    });
    return res.status(500).send(errorObject(500, standardizeObject(e)));
  }
}
