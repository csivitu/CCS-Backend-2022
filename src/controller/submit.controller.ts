import { Request, Response } from "express";
import mongoose from "mongoose";
import QuestionModel from "../models/question.model";
import { SubmitInput } from "../schema/submit.schema";
import { getCcsUserByUsername } from "../service/ccsUser.service";
import constants from "../tools/constants";
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
      ].endTime <= new Date() ||
      user.domainsAttempted[
        user.domainsAttempted.map((obj) => obj.domain).indexOf(domain)
      ].submitted
    ) {
      return res
        .status(200)
        .send(
          errorObject(
            403,
            `Test over for domain ${
              domain.charAt(0).toUpperCase() + domain.slice(1)
            }`
          )
        );
    }

    const populatedQuestions = await Promise.all(
      questions.map(async (question) => ({
        quesId: (
          await QuestionModel.findOne({ quesId: question.quesId })
        )._id as mongoose.Schema.Types.ObjectId,
        answer: question.answer,
      }))
    );

    let autosaveMessage = "autosaved";
    switch (domain) {
      case "tech":
        user.techAttempted = populatedQuestions;
        autosaveMessage = constants.techAutosavedMessage;
        break;
      case "management":
        user.managementAttempted = populatedQuestions;
        autosaveMessage = constants.managementAutosavedMessage;
        break;
      case "design":
        user.designAttempted = populatedQuestions;
        autosaveMessage = constants.designAutosavedMessage;
        break;
      case "video":
        user.videoAttempted = populatedQuestions;
        autosaveMessage = constants.videoAutosavedMessage;
        break;
      default:
        break;
    }

    if (finalSubmit) {
      user.startTime = null;
      user.endTime = null;
      user.questionLoaded = [];
      user.domainsAttempted[
        user.domainsAttempted.map((dom) => dom.domain).indexOf(domain)
      ].submitted = true;
    } else {
      questions.map((ques) => {
        user.questionLoaded[
          user.questionLoaded.map((q) => q.quesId).indexOf(ques.quesId)
        ].answer = ques.answer;
        return ques;
      });
    }

    await user.save();

    logger.info({
      username: user.username,
      message: finalSubmit ? "submitted" : "autosaved",
    });
    if (finalSubmit) {
      testLogger.info({
        username: user.username,
        message: `user ended test for domain: ${
          domain.charAt(0).toUpperCase() + domain.slice(1)
        } at ${new Date()}`,
      });
    }
    return res
      .status(200)
      .send(
        errorObject(
          200,
          finalSubmit
            ? `Your ${
                domain.charAt(0).toUpperCase() + domain.slice(1)
              } quiz has been successfully submitted!`
            : autosaveMessage
        )
      );
  } catch (e) {
    logger.error({
      username: res.locals.user.username,
      error: standardizeObject(e),
    });
    if (e instanceof mongoose.Error.VersionError) {
      return res.status(200).send(errorObject(409, "", standardizeObject(e)));
    }
    return res.status(500).send(errorObject(500, "", standardizeObject(e)));
  }
}
