import { Request, Response } from "express";
import { UserInput } from "../models/user.model";
import { createUser, verifyEmail } from "../service/user.service";
import logger from "../utils/logger";

export async function createUserHandler(
  req: Request<Record<string, never>, Record<string, never>, UserInput>,
  res: Response
) {
  try {
    const response = await createUser(req.body);
    return res.send(response);
  } catch (e: unknown) {
    logger.error(e);
    return res.status(409).send((e as Error).message);
  }
}

export async function verifyEmailHandler(req: Request, res: Response) {
  try {
    const response = await verifyEmail(req.query.token as string);
    return res.send(response);
  } catch (e: unknown) {
    logger.error(e);
    return res.status(409).send((e as Error).message);
  }
}
