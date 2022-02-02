import { Schema } from "mongoose";
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
  userId: Schema.Types.ObjectId,
  domain?: "tech" | "management" | "design" | "video",
  start?: Date,
  end?: Date
) {
  const newUser = await ccsUserModel.create({
    userId,
    username,
    domainsAttempted: domain ? [domain] : [],
    techAttempted: [],
    managementAttempted: [],
    designAttempted: [],
    startTime: start || null,
    endTime: end || null,
  });
  return newUser;
}

export async function getAllUsers() {
  const users = await ccsUserModel.find({}).select(["username"]);
  return users;
}

export async function getCcsUserInfo(_id: Schema.Types.ObjectId) {
  const user = await ccsUserModel
    .findOne({ _id })
    .populate("userId", [
      "-password",
      "-createdAt",
      "-updatedAt",
      "-emailVerificationToken",
      "-passwordResetToken",
      "-verificationStatus",
    ])
    .populate("taskAssigned")
    .populate("techAttempted.quesId")
    .populate("managementAttempted.quesId")
    .populate("designAttempted.quesId")
    .populate("videoAttempted.quesId");
  return user;
}

export async function getCcsUserInfoByUsername(username: string) {
  const user = await ccsUserModel
    .findOne({ username })
    .populate("userId", [
      "-password",
      "-createdAt",
      "-updatedAt",
      "-emailVerificationToken",
      "-passwordResetToken",
      "-verificationStatus",
    ])
    .populate("taskAssigned")
    .populate("techAttempted.quesId")
    .populate("managementAttempted.quesId")
    .populate("designAttempted.quesId")
    .populate("videoAttempted.quesId");
  return user;
}
