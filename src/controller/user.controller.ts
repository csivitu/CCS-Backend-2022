import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import logger from "../utils/logger";

// eslint-disable-next-line import/prefer-default-export
export async function createUserHandler(
  req: Request<
    Record<string, never>,
    Record<string, never>,
    CreateUserInput["body"]
  >,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.send(user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
