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
    if (new Date() > new Date(config.get("task_start_date"))) {
      return res
        .status(200)
        .send(errorObject(403, "https://www.youtube.com/watch?v=dQw4w9WgXcQ"));
    }
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
        ].endTime >= new Date() &&
          !user.domainsAttempted[
            user.domainsAttempted.map((obj) => obj.domain).indexOf(domain)
          ].submitted
          ? res.status(200).send(errorObject(200, "Domain already started"))
          : res.status(200).send(errorObject(403, "Domain already attempted"));
      }

      const attempting =
        user.domainsAttempted[user.domainsAttempted.length - 1];

      if (
        user.domainsAttempted.length > 0 &&
        !attempting.submitted &&
        attempting.endTime >= new Date()
      ) {
        return res.status(200).send(
          errorObject(
            403,
            `Hey ${user.username}! Seems like you are already attempting ${
              attempting.domain.charAt(0).toUpperCase() +
              attempting.domain.slice(1)
            } quiz.`,
            {
              domain: attempting.domain,
            }
          )
        );
      }
      user.domainsAttempted.push({ domain, endTime: end });
      user.startTime = start;
      user.endTime = end;
      user.questionLoaded = [];
      await user.save();
      logger.info({
        username: user.username,
        message: `Started domain ${
          domain.charAt(0).toUpperCase() + domain.slice(1)
        }`,
      });
      testLogger.info({
        username: user.username,
        message: `Started domain ${
          domain.charAt(0).toUpperCase() + domain.slice(1)
        } at ${start}`,
      });
    }
    return res
      .status(200)
      .send(
        errorObject(
          200,
          `Succesfully started domain ${
            domain.charAt(0).toUpperCase() + domain.slice(1)
          }`
        )
      );
  } catch (e) {
    logger.error({
      username: res.locals.user.username,
      error: standardizeObject(e),
    });
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}
