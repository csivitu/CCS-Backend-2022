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
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function verifyEmail(token: string) {
  const participant = await UserModel.findOneAndUpdate(
    {
      emailVerificationToken: token,
    },
    {
      verificationStatus: true,
    }
  );

  if (!participant) {
    return { verified: false, email: participant.email };
  }
  return { verified: true, email: participant.email };
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
