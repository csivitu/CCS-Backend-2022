import { Request, Response } from "express";
import config from "config";
import QuestionModel from "../models/question.model";
import { StartInput } from "../schema/start.schema";
import { getCcsUserByUsername } from "../service/ccsUser.service";
import getQuestion from "../service/question.service";
import errorObject from "../utils/errorObject";
import logger from "../utils/logger";
import standardizeObject from "../utils/standardizeObject";

export default async function questionHandler(
  req: Request<Record<string, never>, Record<string, never>, StartInput>,
  res: Response
) {
  const user = await getCcsUserByUsername(res.locals.user.username);
  const { domain } = req.body;

  try {
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

    if (user.questionLoaded.length > 0) {
      return res.status(200).send(
        errorObject(200, "", {
          questions: user.questionLoaded,
          endTime: user.endTime,
        })
      );
    }

    if (domain === "management") {
      const questions = await QuestionModel.find({
        domain: "management",
      }).limit(config.get<number>("number_of_questions"));
      user.questionLoaded = questions;
      await user.save();
      return res
        .status(200)
        .send(errorObject(200, "", { questions, endTime: user.endTime }));
    }

    const easyquestions = await getQuestion(domain, "Easy");
    const mediumquestions = await getQuestion(domain, "Medium");
    const hardquestions = await getQuestion(domain, "Hard");

    const easyshuffled = easyquestions.sort(() => 0.5 - Math.random());
    let selected = easyshuffled.slice(0, 5);

    const mediumshuffled = mediumquestions.sort(() => 0.5 - Math.random());
    const mediumselected = mediumshuffled.slice(0, 3);

    const hardshuffled = hardquestions.sort(() => 0.5 - Math.random());
    const hardselected = hardshuffled.slice(0, 2);

    selected = selected.concat(hardselected);
    selected = selected.concat(mediumselected);

    user.questionLoaded = selected;
    await user.save();
    // const questionIds = user.questionLoaded.map((ques) => ques.quesId);
    // logger.info(success_codes.S2, { questionIds: questionIds });
    return res.status(200).send(
      errorObject(200, "", {
        questions: selected,
        endTime: user.endTime,
      })
    );
  } catch (e) {
    logger.error({
      username: res.locals.user.username,
      error: standardizeObject(e),
    });
    return res.status(500).send(errorObject(500, standardizeObject(e)));
  }
}
