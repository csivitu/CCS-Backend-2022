import { boolean, object, string, TypeOf } from "zod";
import parsePhoneNumber from "libphonenumber-js";
import config from "config";
import constants from "../tools/constants";
import {
  designSubdomains,
  designSubDomainsType,
  techSubdomains,
  techSubDomainsType,
} from "../types/subdomainTypes";

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

export const AddUserInfoSchema = object({
  body: object({
    description: string().optional(),
    portfolio: object({
      category: string(),
      link: string(),
    }).optional(),
  })
    .refine(
      (data) =>
        !data.portfolio.category ||
        data.portfolio.category === "tech" ||
        data.portfolio.category === "management" ||
        data.portfolio.category === "design" ||
        data.portfolio.category === "video" ||
        data.portfolio.category === "github" ||
        data.portfolio.category === "linkedin" ||
        data.portfolio.category === "instagram" ||
        data.portfolio.category === "spotify" || {
          message: "wrong category for portfolio",
          path: ["portfolio"],
        }
    )
    .refine((data) => data.description || data.portfolio, {
      message: "atleast one required",
      path: ["description", "portfolio"],
    })
    .refine((data) => {
      let url: URL;
      try {
        url = new URL(data.portfolio.link);
      } catch (e) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    }),
});

export const AddUserTaskSchema = object({
  body: object({
    subdomain: string({ required_error: "sub domain is required" }),
    task: string({ required_error: "task link is required" }),
  }).refine(
    (data) =>
      techSubdomains.includes(data.subdomain) ||
      designSubdomains.includes(data.subdomain),
    { message: "wrong subdomain value", path: ["subdomain"] }
  ),
});

export type EmailVerifyInput = TypeOf<typeof emailVerifySchema>["params"];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
export type AddUserInfoInput = {
  description?: string;
  portfolio?: {
    category:
      | "tech"
      | "design"
      | "management"
      | "video"
      | "github"
      | "linkedin"
      | "instagram"
      | "spotify";
    link: string;
  };
};
export type AddUserTaskInput = {
  subdomain: techSubDomainsType | designSubDomainsType;
  task: string;
};
