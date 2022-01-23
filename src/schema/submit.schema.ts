import { boolean, number, object, string } from "zod";
import config from "config";

export const submitSchema = object({
  body: object({
    finalSubmit: boolean({
      required_error: "finalSubmit is required",
    }),
    domain: string({
      required_error: "domain is required",
    }),
    questions: object(
      {
        quesId: number(),
        answer: string(),
      },
      { required_error: "questions object is required" }
    )
      .array()
      .length(config.get<number>("number_of_questions")),
  }).refine(
    (data) =>
      data.domain === "Tech" ||
      data.domain === "Management" ||
      data.domain === "Design" ||
      data.domain === "Video",
    {
      message: "wrong values",
      path: ["domain"],
    }
  ),
});

export type SubmitInput = {
  finalSubmit: boolean;
  domain: "Tech" | "Management" | "Design" | "Video";
  questions: {
    quesId: number;
    answer: string;
  }[];
};
