import { number, object, string } from "zod";

export const adminPostSchema = object({
  body: object({
    username: string({ required_error: "username is required" }),
    round: number().optional(),
    domain: string({
      required_error: "domain is required",
    }),
    comment: string().optional(),
    mark: number()
      .min(0, "Marks cannot be negative")
      .max(10, "marks cannot be greater than 10")
      .optional(),
  })
    .refine(
      (data) =>
        data.domain === "Tech" ||
        data.domain === "Management" ||
        data.domain === "Design" ||
        data.domain === "Video",
      {
        message: "wrong values",
        path: ["domain"],
      }
    )
    .refine((data) => data.comment || data.mark || data.round, {
      message: "atleast one required",
      path: ["comment", "mark", "round"],
    })
    .refine(
      (data) =>
        !data.round ||
        data.round === 0 ||
        data.round === 1 ||
        data.round === 2 ||
        data.round === 3,
      {
        message: "wrong value for round",
        path: ["round"],
      }
    ),
});

export type AdminPostInput = {
  username: string;
  round?: 0 | 1 | 2 | 3;
  domain: "Tech" | "Management" | "Design" | "Video";
  comment?: string;
  mark?: number;
};
