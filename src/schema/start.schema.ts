import { object, string } from "zod";

// eslint-disable-next-line import/prefer-default-export
export const startSchema = object({
  body: object({
    // username: string({
    //   required_error: "Username is required",
    // }),
    // email: string({
    //   required_error: "Email is required",
    // }).email("Not a valid email"),
    domain: string({
      required_error: "domain is required",
    }),
  }),
});

// export default startSchema;
