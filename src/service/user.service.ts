import { FilterQuery } from "mongoose";
import { omit } from "lodash";
// import url from "url";
// import rp from "request-promise";

// import { constants } from "../tools/constants";
import { sendVerificationMail } from "../tools/sendMail";
// import generateToken from "../tools/tokenGenerator";
import UserModel, { UserDocument, UserInput } from "../models/user.model";

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);
    sendVerificationMail(user);
    return omit(user.toJSON(), "password");
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
