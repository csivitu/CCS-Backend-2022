import { object, string } from "zod";
import constants from "../tools/constants";

export const createSessionSchema = object({
  body: object({
    usernameOrEmail: string({
      required_error: "Username or Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
  })
    .refine(
      (data) =>
        constants.vitEmailRegex.test(data.usernameOrEmail) ||
        constants.usernameRegex.test(data.usernameOrEmail),
      {
        message: "Invalid Username or Email",
        path: ["usernameOrEmail"],
      }
    )
    .refine((data) => constants.passwordRegex.test(data.password), {
      message: "invalid password",
      path: ["password"],
    }),
});

export type SessionInput = {
  usernameOrEmail: string;
  password: string;
};
