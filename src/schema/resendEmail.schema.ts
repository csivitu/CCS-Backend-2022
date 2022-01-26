import { object, string } from "zod";

export const resendEmailSchema = object({
  body: object({
    email: string({
      required_error: "email is required",
    }).email(),
  }),
});

export type ResendEmailInput = { email: string };
