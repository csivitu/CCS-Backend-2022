import { Request, Response } from "express";
import mongoose from "mongoose";
import QuestionModel from "../models/question.model";
import { SubmitInput } from "../schema/submit.schema";
import { getCcsUserByUsername } from "../service/ccsUser.service";
import errorObject from "../utils/errorObject";
import logger, { testLogger } from "../utils/logger";
import standardizeObject from "../utils/standardizeObject";

export default async function submitHandler(
  req: Request<Record<string, never>, Record<string, never>, SubmitInput>,
  res: Response
) {
  try {
    const decodedUser = res.locals.user;

    const { finalSubmit, domain, questions } = req.body;

    const user = await getCcsUserByUsername(decodedUser.username);
    if (!user) {
      return res.status(200).send(errorObject(404, "user not found"));
    }

    if (!user.domainsAttempted.map((obj) => obj.domain).includes(domain)) {
      return res.status(200).send(errorObject(403, "domain not started"));
    }

    if (
      user.domainsAttempted[
        user.domainsAttempted.map((obj) => obj.domain).indexOf(domain)
      ].endTime < new Date()
    ) {
      return res
        .status(200)
        .send(errorObject(403, `test over for domain ${domain}`));
    }

    const populatedQuestions = await Promise.all(
      questions.map(async (question) => ({
        quesId: (
          await QuestionModel.findOne({ quesId: question.quesId })
        )._id as mongoose.Schema.Types.ObjectId,
        answer: question.answer,
      }))
    );

    switch (domain) {
      case "Tech":
        user.techAttempted = populatedQuestions;
        break;
      case "Management":
        user.managementAttempted = populatedQuestions;
        break;
      case "Design":
        user.designAttempted = populatedQuestions;
        break;
      case "Video":
        user.videoAttempted = populatedQuestions;
        break;
      default:
        break;
    }

    if (finalSubmit) {
      user.startTime = null;
      user.endTime = null;
    }

    user.save();

    logger.info({
      username: user.username,
      message: finalSubmit ? "submitted" : "autosaved",
    });
    if (finalSubmit) {
      testLogger.info({
        username: user.username,
        message: `user ended test for domain: ${domain} at ${new Date()}`,
      });
    }
    return res.status(200).send(errorObject(200, "autosaved"));
  } catch (e) {
    logger.error({
      username: res.locals.user.username,
      error: standardizeObject(e),
    });
    return res.status(500).send(errorObject(500, standardizeObject(e)));
  }
}
