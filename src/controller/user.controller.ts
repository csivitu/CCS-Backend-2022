import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { UserInput } from "../models/user.model";
import {
  EmailVerifyInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyEmail,
} from "../service/user.service";
import logger from "../utils/logger";

export async function createUserHandler(
  req: Request<Record<string, never>, Record<string, never>, UserInput>,
  res: Response
) {
  try {
    const response = await createUser(req.body);
    return res.send(response);
  } catch (e: unknown) {
    logger.error(e);
    return res.status(409).send((e as Error).message);
  }
}

export async function verifyEmailHandler(
  req: Request<EmailVerifyInput>,
  res: Response
) {
  try {
    const response = await verifyEmail(req.params.id, req.params.token);
    return res.send(response);
  } catch (e: unknown) {
    logger.error(e);
    return res.status(409).send((e as Error).message);
  }
}

export async function forgotPasswordHandler(
  req: Request<
    Record<string, never>,
    Record<string, never>,
    ForgotPasswordInput
  >,
  res: Response
) {
  const message =
    "If a user with that email is registered and verified you will receive a password reset email";
  const user = await findUserByEmail(req.body.email);
  if (user && user.verificationStatus) {
    // send forgot password mail
    const passwordResetCode = nanoid();
    user.passwordResetToken = passwordResetCode;
    console.log(passwordResetCode);
    user.save();
  }
  return res.send(message);
}
export async function resetPasswordHandler(
  req: Request<
    ResetPasswordInput["params"],
    Record<string, never>,
    ResetPasswordInput["body"]
  >,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;
  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetToken ||
    user.passwordResetToken !== passwordResetCode
  ) {
    return res.status(400).send("Could not reset user password");
  }

  user.passwordResetToken = null;

  user.password = password;

  await user.save();

  return res.send("Successfully updated password");
}
