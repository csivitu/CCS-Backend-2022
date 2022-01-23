import { object, string } from "zod";

export const startSchema = object({
  body: object({
    domain: string({
      required_error: "domain is required",
    }),
  }).refine(
    (data) =>
      data.domain === "Tech" ||
      data.domain === "Management" ||
      data.domain === "Design",
    {
      message: "wrong values",
      path: ["domain"],
    }
  ),
});

export type StartInput = { domain: "Tech" | "Management" | "Design" };
