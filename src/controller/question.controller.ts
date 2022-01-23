import { Request, Response } from "express";
import { StartInput } from "../schema/start.schema";
import { getCcsUserByUsername } from "../service/ccsUser.service";
import getQuestion from "../service/question.service";

export default async function questionHandler(
  req: Request<Record<string, never>, Record<string, never>, StartInput>,
  res: Response
) {
  const user = await getCcsUserByUsername(res.locals.user.username);
  const { domain } = req.body;

  try {
    if (!user.domainsAttempted.includes(domain)) {
      //   logger.warn(logical_errors.L6, { username: username });
      return res.json({
        code: "L6",
      });
    }
    if (!user.endTime) {
      // console.log("test not started or time over");
      //   loggerStartEnd.warn(logical_errors.L4, { username: username });
      return res.json({
        code: "L4",
      });
    }
    if (user.endTime < new Date()) {
      //   console.log("time over");
      user.startTime = null;
      user.endTime = null;
      user.save();
      //   loggerStartEnd.warn(logical_errors.L3, { username: username });
      return res.json({
        code: "L3",
      });
    }
    if (user.questionLoaded) {
      //   const questionIds = user.questionLoaded.map((ques) => ques.quesId);
      //   logger.info(success_codes.S2, { questionIds: questionIds });
      return res.json({
        code: "S2",
        question: user.questionLoaded,
      });
    }
    const easyquestions = await getQuestion(domain, "Easy");
    const mediumquestions = await getQuestion(domain, "Medium");
    const hardquestions = await getQuestion(domain, "Hard");

    const easyshuffled = easyquestions.sort(() => 0.5 - Math.random());
    let selected = easyshuffled.slice(0, 2);

    const mediumshuffled = mediumquestions.sort(() => 0.5 - Math.random());
    const mediumselected = mediumshuffled.slice(0, 2);

    const hardshuffled = hardquestions.sort(() => 0.5 - Math.random());
    const hardselected = hardshuffled.slice(0, 2);

    selected = selected.concat(hardselected);
    selected = selected.concat(mediumselected);

    user.questionLoaded = selected;
    user.save();
    // const questionIds = user.questionLoaded.map((ques) => ques.quesId);
    // logger.info(success_codes.S2, { questionIds: questionIds });
    return res.send({
      questions: selected,
    });
  } catch (e) {
    // logger.error(error_codes.E0);
    return res.status(500).send(e);
  }
}
