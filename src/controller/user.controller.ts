import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Schema } from "mongoose";
import config from "config";
import ccsUserModel from "../models/ccsUser.model";
import TaskModel from "../models/task.model";
import { UserDocument, UserInput } from "../models/user.model";
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
    logger.warn({
      message: `${req.body.username} registered`,
      username: req.body.username,
    });
    return res.status(200).send(errorObject(200, "", response));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}

export async function verifyEmailHandler(
  req: Request<EmailVerifyInput>,
  res: Response
) {
  try {
    const response = await verifyEmail(req.params.user, req.params.token);
    const redirectUrl = new URL(config.get("email_verified_redirect"));
    redirectUrl.searchParams.append("verified", `${response.verified}`);
    redirectUrl.searchParams.append("msg", response.message);
    logger.warn({
      message: `${req.params.user} verified email`,
      username: req.params.user,
    });
    return res.redirect(redirectUrl.href);
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
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
      await user.save();
      await sendResetPasswordMail(user);
    }
    return res.status(200).send(errorObject(200, message));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
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
        .status(200)
        .send(errorObject(400, "Could not reset user password"));
    }

    user.passwordResetToken = null;

    user.password = password;

    await user.save();

    logger.warn({
      message: `${user.username} reset password`,
      username: user.username,
    });

    return res
      .status(200)
      .send(errorObject(200, "Successfully updated password"));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}

export async function resendEmailHandler(
  req: Request<Record<string, never>, Record<string, never>, ResendEmailInput>,
  res: Response
) {
  try {
    const user = await findUserByEmail(req.body.email);
    sendVerificationMail(user);
    return res
      .status(200)
      .send(errorObject(200, "Successfully sent mail again"));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(404).send(errorObject(404, "", standardizeObject(e)));
  }
}

export async function getUserHandler(req: Request, res: Response) {
  try {
    const _id = res.locals.user._id as Schema.Types.ObjectId;
    const user = await getCcsUserInfo(_id);
    return res.status(200).send(errorObject(200, "", user));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}

export async function addUserInfoHandler(
  req: Request<Record<string, never>, Record<string, never>, AddUserInfoInput>,
  res: Response
) {
  try {
    const { username } = res.locals.user;
    const user = await ccsUserModel.findOne({ username });
    if (req.body.description) {
      user.description = req.body.description;
    }
    if (req.body.portfolio) {
      if (
        !user.portfolio
          .map((obj) => obj.category)
          .includes(req.body.portfolio.category)
      ) {
        user.portfolio.push({
          category: req.body.portfolio.category,
          link: req.body.portfolio.link,
        });
      } else {
        user.portfolio[
          user.portfolio
            .map((obj) => obj.category)
            .indexOf(req.body.portfolio.category)
        ].link = req.body.portfolio.link;
      }
    }
    await user.save();
    return res
      .status(200)
      .send(errorObject(200, "Successfully updated portfolio."));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}
export async function addUserTaskHandler(
  req: Request<Record<string, never>, Record<string, never>, AddUserTaskInput>,
  res: Response
) {
  try {
    const { username } = res.locals.user;
    const user = await ccsUserModel.findOne({ username });

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
    await user.save();
    logger.warn({ username: user.username, message: "Task saved for user" });
    return res
      .status(200)
      .send(errorObject(200, "successfully updated user task"));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}

export async function getUserTaskHandler(req: Request, res: Response) {
  try {
    const { username } = res.locals.user as UserDocument;
    const user = await ccsUserModel.findOne({ username });
    const domains = [] as ("tech" | "design")[];
    user.domainsAttempted.forEach((dom) => {
      if (dom.domain === "tech") {
        domains.push("tech");
      }
      if (dom.domain === "design") {
        domains.push("design");
      }
    });
    const tasks = await TaskModel.find({ domain: { $in: domains } });
    return res.status(200).send(errorObject(200, "", tasks));
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}

export async function userStatsHandler(req: Request, res: Response) {
  try {
    const users = await ccsUserModel.find().populate("userId");
    const nonCSI = users.filter(
      (user) =>
        !(user.userId as unknown as UserDocument).scope.includes("admin")
    );
    const userCount = nonCSI.length;
    const activeUserCount = nonCSI.filter(
      (user) =>
        user.domainsAttempted.length > 0 &&
        user.techAttempted
          .concat(user.managementAttempted)
          .concat(user.designAttempted)
          .concat(user.videoAttempted)
          .filter((ques) => ques.answer !== "").length > 0
    ).length;
    const tech = nonCSI.filter(
      (user) =>
        user.domainsAttempted.map((dom) => dom.domain).includes("tech") &&
        user.techAttempted.filter((ques) => ques.answer !== "").length > 0
    );
    const management = nonCSI.filter(
      (user) =>
        user.domainsAttempted.map((dom) => dom.domain).includes("management") &&
        user.managementAttempted.filter((ques) => ques.answer !== "").length > 0
    );
    const design = nonCSI.filter(
      (user) =>
        user.domainsAttempted.map((dom) => dom.domain).includes("design") &&
        user.designAttempted.filter((ques) => ques.answer !== "").length > 0
    );
    const video = nonCSI.filter(
      (user) =>
        user.domainsAttempted.map((dom) => dom.domain).includes("video") &&
        user.videoAttempted.filter((ques) => ques.answer !== "").length > 0
    );

    const [
      techCorrected,
      managementCorrected,
      designCorrected,
      videoCorrected,
    ] = [
      tech.filter((user) => user.checked.tech),
      management.filter((user) => user.checked.management),
      design.filter((user) => user.checked.design),
      video.filter((user) => user.checked.video),
    ];

    const techSelected = tech.filter(
      (user) => user.marks.tech >= config.get<number>("tech_cutoff")
    ).length;
    const managementSelected = management.filter(
      (user) => user.marks.management >= config.get<number>("management_cutoff")
    ).length;
    const designSelected = design.filter(
      (user) => user.marks.design >= config.get<number>("design_cutoff")
    ).length;
    const videoSelected = video.filter(
      (user) => user.marks.video >= config.get<number>("video_cutoff")
    ).length;
    return res.status(200).send(
      errorObject(
        200,
        "These are the stats for the users excluding CSI peeps and excluding ppl who have attempted the quiz and not given any answers, basically only absolutely legit users",
        {
          userCount,
          activeUserCount,
          tech: {
            attempted: tech.length,
            corrected: techCorrected.length,
            selected: techSelected,
          },
          management: {
            attempted: management.length,
            corrected: managementCorrected.length,
            selected: managementSelected,
          },
          design: {
            attempted: design.length,
            corrected: designCorrected.length,
            selected: designSelected,
          },
          video: {
            attempted: video.length,
            corrected: videoCorrected.length,
            selected: videoSelected,
          },
          totalSelected:
            techSelected + managementSelected + designSelected + videoSelected,
        }
      )
    );
  } catch (e) {
    logger.error(standardizeObject(e));
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}
