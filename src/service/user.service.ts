import { FilterQuery } from "mongoose";
import { omit } from "lodash";
import crypto from "crypto";
import UserModel, { UserDocument, UserInput } from "../models/user.model";
import constants from "../tools/constants";
import { sendVerificationMail } from "../tools/sendMail";

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
    sendVerificationMail(user);
    jsonResponse.success = true;
    jsonResponse.message = constants.registrationSuccess;
    return jsonResponse;
  } catch (e: unknown) {
    throw new Error(e as string);
  }
}

export async function validatePassword({
  email,
  password,
  username,
}: {
  email: string | undefined;
  password: string;
  username: string | undefined;
}) {
  const user = await UserModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function verifyEmail(id: string, token: string) {
  const participant = await findUser({ _id: id });

  if (!participant) {
    return {
      verified: false,
      email: participant.email,
      message: "cannot verify",
    };
  }

  if (participant.verificationStatus) {
    return {
      verified: true,
      email: participant.email,
      message: "already verified",
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
      message: "succesfully verified",
    };
  }
  return {
    verified: false,
    email: participant.email,
    message: "wrong verification token",
  };
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
export async function findUserById(id: string) {
  return UserModel.findOne({ _id: id });
}
