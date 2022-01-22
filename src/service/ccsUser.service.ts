import ccsUserModel, { ccsUserInterface } from "../models/ccsUser.model";
import logger from "../utils/logger";

export async function getCcsUserByUsername(username: string) {
  return ccsUserModel.findOne({ username });
}

export function checkTime(user: ccsUserInterface) {
  if (!user.endTime) {
    // console.log("test not started or time over");
    logger.warn({ username: user.username, code: 403 });
    return "No test started";
  }
  if (user.endTime < new Date()) {
    // console.log("time over");
    user.startTime = null;
    user.endTime = null;
    user.save();
    logger.warn({ username: user.username, code: 403 });
    return "Test time ended";
  }
  return true;
}
