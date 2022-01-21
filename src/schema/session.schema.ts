import { object, string } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const createSessionSchema = object({
  body: object({
    email: string().optional(),
    username: string().optional(),
    password: string({
      required_error: "Password is required",
    }),
  }).refine((data) => data.username || data.email, {
    message: "Username or email is required",
    path: ["email", "username"],
  }),
});
