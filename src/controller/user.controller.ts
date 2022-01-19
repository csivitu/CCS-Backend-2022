import { Request, Response } from "express";
import { UserInput } from "../models/user.model";
// import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import logger from "../utils/logger";

// eslint-disable-next-line import/prefer-default-export
export async function createUserHandler(
  req: Request<Record<string, never>, Record<string, never>, UserInput>,
  res: Response
) {
  try {
    const response = await createUser(req.body);
    return res.send(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
