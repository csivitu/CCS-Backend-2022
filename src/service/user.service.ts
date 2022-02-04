import { FilterQuery } from "mongoose";
import { omit } from "lodash";
import crypto from "crypto";
import UserModel, {
  privateFields,
  UserDocument,
  UserInput,
} from "../models/user.model";
import constants from "../tools/constants";
import { sendVerificationMail } from "../tools/sendMail";
import { createCcsUser } from "./ccsUser.service";
import logger from "../utils/logger";
import { SessionInput } from "../schema/session.schema";

export async function createUser(input: UserInput) {
  try {
    const jsonResponse = {
      success: false,
      message: constants.defaultResponse,
      redirect: "",
      redirectClient: "",
      duplicates: [] as string[],
    };
    let duplicate: UserDocument;
    if (input.isVitian) {
      duplicate = await UserModel.findOne({
        $or: [
          { email: input.email },
          { username: input.username },
          { regNo: input.regNo },
        ],
      });
    } else {
      duplicate = await UserModel.findOne({
        $or: [{ email: input.email }, { username: input.username }],
      });
    }
    if (duplicate) {
      jsonResponse.message = constants.duplicate;
      jsonResponse.duplicates = [];
      if (duplicate.email === input.email) {
        jsonResponse.duplicates.push("Email");
      }
      if (duplicate.username === input.username) {
        jsonResponse.duplicates.push("Username");
      }

      if (input.isVitian && duplicate.regNo === input.regNo) {
        jsonResponse.duplicates.push("Registration Number");
      }

      return jsonResponse;
    }
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const user = await UserModel.create({
      ...input,
      emailVerificationToken,
      scope: ["user"],
    });
    const ccsUser = await createCcsUser(user.username, user._id);
    logger.info({
      username: ccsUser.username,
      message: "User created in accounts and ccs DB",
    });
    sendVerificationMail(user);
    jsonResponse.success = true;
    jsonResponse.message = constants.registrationSuccess;
    return jsonResponse;
  } catch (e) {
    throw new Error(e);
  }
}

export async function validatePassword({
  usernameOrEmail,
  password,
}: SessionInput) {
  try {
    const user = await UserModel.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
      return false;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) return false;

    return omit(user.toJSON(), privateFields);
  } catch (e) {
    throw new Error(e);
  }
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query);
}

export async function verifyEmail(id: string, token: string) {
  try {
    const participant = await findUser({ _id: id });

    if (!participant) {
      return {
        verified: false,
        message: "Cannot Verify",
      };
    }

    if (participant.verificationStatus) {
      return {
        verified: true,
        email: participant.email,
        message: "Already Verified",
      };
    }

    if (participant.emailVerificationToken === token) {
      await UserModel.findOneAndUpdate(
        { _id: participant._id },
        { verificationStatus: true }
      );
      return {
        verified: true,
        email: participant.email,
        message: "Successfully Verified",
      };
    }
    return {
      verified: false,
      email: participant.email,
      message: "Wrong Verification Token",
    };
  } catch (e) {
    throw new Error(e);
  }
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
export async function findUserById(id: string) {
  return UserModel.findOne({ _id: id });
}
