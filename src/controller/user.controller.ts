import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Schema } from "mongoose";
import ccsUserModel from "../models/ccsUser.model";
import TaskModel from "../models/task.model";
import { UserInput } from "../models/user.model";
import { ResendEmailInput } from "../schema/resendEmail.schema";
import {
  AddUserInfoInput,
  AddUserTaskInput,
  EmailVerifyInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schema/user.schema";
import { getCcsUserInfo } from "../service/ccsUser.service";
import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyEmail,
} from "../service/user.service";
import { sendResetPasswordMail, sendVerificationMail } from "../tools/sendMail";
import errorObject from "../utils/errorObject";
import logger from "../utils/logger";
import standardizeObject from "../utils/standardizeObject";

export async function createUserHandler(
  req: Request<Record<string, never>, Record<string, never>, UserInput>,
  res: Response
) {
  try {
    const response = await createUser(req.body);
    return res.send(errorObject(200, "", response));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(409).send(errorObject(409, standardizeObject(e)));
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
    logger.error(standardizeObject(e));
    return res.status(404).send(errorObject(404, standardizeObject(e)));
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
      await sendResetPasswordMail(user);
    }
    return res.send(errorObject(200, message));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(404).send(errorObject(404, standardizeObject(e)));
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
    logger.error(standardizeObject(e));
    return res.status(404).send(errorObject(404, standardizeObject(e)));
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
    logger.error(standardizeObject(e));
    return res.status(404).send(errorObject(404, standardizeObject(e)));
  }
}

export async function getUserHandler(req: Request, res: Response) {
  try {
    const _id = res.locals.user._id as Schema.Types.ObjectId;
    const user = await getCcsUserInfo(_id);
    return res.send(errorObject(200, "", user));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(404).send(errorObject(404, standardizeObject(e)));
  }
}

export async function addUserInfoHandler(
  req: Request<Record<string, never>, Record<string, never>, AddUserInfoInput>,
  res: Response
) {
  try {
    const { _id } = res.locals.user;
    const user = await ccsUserModel.findOne({ _id });
    if (req.body.description) {
      user.description = req.body.description;
    }
    if (req.body.portfolio) {
      user.portfolio = req.body.portfolio;
    }
    user.save();
    return res.send(errorObject(200, "successfully updated user"));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(404).send(errorObject(404, standardizeObject(e)));
  }
}
export async function addUserTaskHandler(
  req: Request<Record<string, never>, Record<string, never>, AddUserTaskInput>,
  res: Response
) {
  try {
    const { _id } = res.locals.user;
    const user = await ccsUserModel.findOne({ _id });
    if (
      !user.taskSubmitted
        .map((tsk) => tsk.subdomain)
        .includes(req.body.subdomain)
    ) {
      user.taskSubmitted.push({
        subdomain: req.body.subdomain,
        task: req.body.task,
      });
    } else {
      user.taskSubmitted[
        user.taskSubmitted
          .map((tsk) => tsk.subdomain)
          .indexOf(req.body.subdomain)
      ].task = req.body.task;
    }
    user.save();
    return res.send(errorObject(200, "successfully updated user task"));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(404).send(errorObject(404, standardizeObject(e)));
  }
}

export async function getUserTaskHandler(req: Request, res: Response) {
  try {
    const tasks = await TaskModel.find({});
    return res.send(errorObject(200, "", tasks));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, standardizeObject(e)));
  }
}
