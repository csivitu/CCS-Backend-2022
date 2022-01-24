import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { UserInput } from "../models/user.model";
import { ResendEmailInput } from "../schema/resendEmail.schema";
import {
  EmailVerifyInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schema/user.schema";
import { getCcsUserInfoByEmail } from "../service/ccsUser.service";
import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyEmail,
} from "../service/user.service";
import { sendVerificationMail } from "../tools/sendMail";
import errorObject from "../utils/errorObject";
import logger from "../utils/logger";

export async function createUserHandler(
  req: Request<Record<string, never>, Record<string, never>, UserInput>,
  res: Response
) {
  try {
    const response = await createUser(req.body);
    return res.send(errorObject(200, "", response));
  } catch (e) {
    logger.error(e);
    return res.status(409).send(errorObject(409, e));
  }
}

export async function verifyEmailHandler(
  req: Request<EmailVerifyInput>,
  res: Response
) {
  try {
    const response = await verifyEmail(req.params.user, req.params.token);
    return res.send(errorObject(200, "", response));
  } catch (e) {
    logger.error(e);
    return res.status(404).send(errorObject(404, e));
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
  try {
    const message =
      "If a user with that email is registered and verified you will receive a password reset email";
    const user = await findUserByEmail(req.body.email);
    if (user && user.verificationStatus) {
      const passwordResetCode = nanoid();
      user.passwordResetToken = passwordResetCode;
      // send forgot password mail
      console.log(passwordResetCode);
      user.save();
    }
    return res.send(errorObject(200, message));
  } catch (e) {
    logger.error(e);
    return res.status(404).send(errorObject(404, e));
  }
}
export async function resetPasswordHandler(
  req: Request<
    ResetPasswordInput["params"],
    Record<string, never>,
    ResetPasswordInput["body"]
  >,
  res: Response
) {
  try {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    const user = await findUserById(id);

    if (
      !user ||
      !user.passwordResetToken ||
      user.passwordResetToken !== passwordResetCode
    ) {
      return res
        .status(400)
        .send(errorObject(400, "Could not reset user password"));
    }

    user.passwordResetToken = null;

    user.password = password;

    await user.save();

    return res.send(errorObject(200, "Successfully updated password"));
  } catch (e) {
    logger.error(e);
    return res.status(404).send((e as Error).message);
  }
}

export async function resendEmailHandler(
  req: Request<Record<string, never>, Record<string, never>, ResendEmailInput>,
  res: Response
) {
  try {
    const user = await findUserByEmail(req.body.email);
    sendVerificationMail(user);
    return res.send(errorObject(200, "Successfully sent mail again"));
  } catch (e) {
    logger.error(e);
    return res.status(404).send(errorObject(404, e));
  }
}

export async function getUserHandler(req: Request, res: Response) {
  try {
    const { email } = res.locals.user;
    const user = await getCcsUserInfoByEmail(email);
    return res.send(errorObject(200, "", user));
  } catch (e) {
    logger.error(e);
    return res.status(404).send(errorObject(404, e));
  }
}
