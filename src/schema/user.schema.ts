import { boolean, object, string, TypeOf } from "zod";
import parsePhoneNumber from "libphonenumber-js";
import config from "config";
import constants from "../tools/constants";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    username: string({
      required_error: "Username is required",
    })
      .min(3, "Username too short - should be 3 chars minimum")
      .max(20, "Password too long - should be 20 chars maximum"),
    password: string({
      required_error: "Name is required",
    })
      .min(8, "Password too short - should be 8 chars minimum")
      .max(50, "Password too long - should be 50 chars maximum"),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    phone: string({
      required_error: "Phone number is required",
    }),
    isVitian: boolean({
      required_error: "Vitian or not is required",
    }),
    regNo: string(),
    gender: string({
      required_error: "Gender is required",
    }),
  })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords do not match",
      path: ["passwordConfirmation"],
    })
    .refine((data) => parsePhoneNumber(data.phone).isValid(), {
      message: "Not a valid phone number",
      path: ["phone"],
    })
    .refine(
      (data) => {
        if (data.isVitian) {
          return constants.vitEmailRegex.test(data.email);
        }
        return constants.emailRegex.test(data.email);
      },
      {
        message: "not a valid email",
        path: ["email"],
      }
    )
    .refine(
      (data) => {
        if (data.isVitian) {
          return constants.regNoRegex.test(data.regNo);
        }
        return true;
      },
      {
        message: "Invalid registration number",
        path: ["regNo"],
      }
    )
    .refine((data) => constants.usernameRegex.test(data.username), {
      message: "invalid username",
      path: ["username"],
    })
    .refine((data) => constants.passwordRegex.test(data.password), {
      message: "invalid password",
      path: ["password"],
    })
    .refine((data) => data.gender === "M" || data.gender === "F", {
      message: "Invalid value of gender",
      path: ["gender"],
    }),
});

export const emailVerifySchema = object({
  params: object({
    user: string(),
    token: string(),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "email is required" }).email(
      "not a valid email"
    ),
  }),
});
export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password is too short - should be min 8 chars")
      .max(50, "Password too long - should be 50 chars maximum"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const ccsUserSchema = object({
  body: object({
    questions: object({})
      .array()
      .length(config.get<number>("number_of_questions")),
  }),
});

export type EmailVerifyInput = TypeOf<typeof emailVerifySchema>["params"];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
