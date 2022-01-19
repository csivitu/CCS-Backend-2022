import { FilterQuery } from "mongoose";
import { omit } from "lodash";
// import url from "url";
// import rp from "request-promise";
import crypto from "crypto";

// import { constants } from "../tools/constants";

// import generateToken from "../tools/tokenGenerator";
import UserModel, { UserDocument, UserInput } from "../models/user.model";
import constants from "../tools/constants";
// import { sendVerificationMail } from "../routes";

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await UserModel.create({
      ...input,
      emailVerificationToken,
      scope: ["user"],
    });
    // sendVerificationMail(user);
    jsonResponse.success = true;
    jsonResponse.message = constants.registrationSuccess;
    return jsonResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e);
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

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
