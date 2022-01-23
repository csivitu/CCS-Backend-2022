import { number, object, string } from "zod";

export const adminPostSchema = object({
  body: object({
    username: string({ required_error: "username is required" }),
    round: number({ required_error: "round is required" }),
  }).refine(
    (data) =>
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
  round: 0 | 1 | 2 | 3;
};
