import { object, string } from "zod";

export const startSchema = object({
  body: object({
    domain: string({
      required_error: "domain is required",
    }),
  }).refine(
    (data) =>
      data.domain === "tech" ||
      data.domain === "management" ||
      data.domain === "design" ||
      data.domain === "video",
    {
      message: "wrong values",
      path: ["domain"],
    }
  ),
});

export type StartInput = { domain: "tech" | "management" | "design" | "video" };
