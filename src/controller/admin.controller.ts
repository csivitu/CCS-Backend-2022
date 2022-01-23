import { Request, Response } from "express";
import logger from "../utils/logger";

// eslint-disable-next-line import/prefer-default-export
export async function getUsersHandler(req: Request, res: Response) {
  try {
    return false;
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
