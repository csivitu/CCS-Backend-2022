import { Request, Response } from "express";
import moment from "moment";
import ccsUserModel from "../models/ccsUser.model";
import { getUser } from "../service/ccsUser.service";
// import logger from "../utils/logger";
// import {
//   error_codes,
//   logical_errors,
//   success_codes,
// } from "../tools/constants";

export default async function startHandler(req: Request, res: Response) {
  const user = await getUser(res.locals.user.username);
  const { domain } = req.body;
  const start: Date = new Date();
  const end: Date = moment(start).add(process.env.DURATION, "m").toDate();
  try {
    if (!user) {
      console.log("user doesnot exist");
      // eslint-disable-next-line new-cap
      const newUser = new ccsUserModel({
        username: res.locals.user.username,
        domainsAttempted: [domain],
        techAttempted: [],
        managementAttempted: [],
        designAttempted: [],
        startTime: start,
        endTime: end,
        round: 1,
      });
      newUser.save();
    } else {
      console.log("user exists");
      if (user.domainsAttempted.includes(domain)) {
        // console.log("in")
        // logger.warn(logical_errors.L2, { username: username });
        return res.json({
          //   code: "L2",
          message: "Domain added",
        });
      }
      user.domainsAttempted.push(domain);
      user.startTime = start;
      user.endTime = end;
      user.questionLoaded = null;
      user.save();
    }
    return res.json({
      //   code: "S4",
      message: "success",
    });
  } catch (error) {
    // logger.error(error_codes.E0);
    return res.status(500).json({
      //   code: "E0",
      message: error,
    });
  }
}
