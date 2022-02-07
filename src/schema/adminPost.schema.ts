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
        data.domain === "tech" ||
        data.domain === "management" ||
        data.domain === "design" ||
        data.domain === "video",
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

export const AdminGetUserSchema = object({
  params: object({
    regNo: string(),
  }),
});

export const AdminPutSchema = object({
  body: object({
    username: string({ required_error: "username is required" }),
    domain: string({
      required_error: "domain is required",
    }),
  }).refine(
    (data) =>
      data.domain === "tech" ||
      data.domain === "management" ||
      data.domain === "design" ||
      data.domain === "video",
    {
      message: "wrong values",
      path: ["domain"],
    }
  ),
});

export const AdminDeleteUserSchema = object({
  body: object({
    username: string({ required_error: "username is required" }),
  }),
});

export type AdminPostInput = {
  username: string;
  round?: 0 | 1 | 2 | 3;
  domain: "tech" | "management" | "design" | "video";
  comment?: string;
  mark?: number;
};

export type AdminGetUserInput = {
  regNo?: string;
};
export type AdminPutInput = {
  username: string;
  domain: "tech" | "management" | "design" | "video";
};

export type AdminDeleteUserInput = {
  username: string;
};

// export type MakeAdminInput = {
//   username: string;
//   token: string;
// };
