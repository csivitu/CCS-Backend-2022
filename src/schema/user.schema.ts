import { boolean, object, string } from "zod";
import parsePhoneNumber from "libphonenumber-js";
import constants from "../tools/constants";

const createUserSchema = object({
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
    .refine((data) => data.gender === "M" || data.gender === "F", {
      message: "Invalid value of gender",
      path: ["gender"],
    }),
});

export default createUserSchema;
