import { object, string } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
  }),
});
