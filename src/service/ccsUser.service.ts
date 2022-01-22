import ccsUserModel from "../models/ccsUser.model";
import logger from "../utils/logger";

export async function getCcsUserByUsername(username: string) {
  return ccsUserModel.findOne({ username });
}

export async function checkTime(username: string) {
  const user = await getCcsUserByUsername(username);
  if (!user) {
    return "User not found";
  }
  if (!user.endTime) {
    return "No test started";
  }
  if (user.endTime < new Date()) {
    user.startTime = null;
    user.endTime = null;
    user.save();
    logger.warn({ username: user.username, code: 403, message: "Time over" });
    return "Test time ended";
  }
  return true;
}

export async function createCcsUser(
  username: string,
  domain?: "Tech" | "Management" | "Design",
  start?: Date,
  end?: Date
) {
  const newUser = await ccsUserModel.create({
    username,
    domainsAttempted: domain ? [domain] : [],
    techAttempted: [],
    managementAttempted: [],
    designAttempted: [],
    startTime: start || null,
    endTime: end || null,
    round: 1,
  });
  return newUser;
}