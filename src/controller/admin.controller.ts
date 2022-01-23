import { Request, Response } from "express";
import { AdminPostInput } from "../schema/adminPost.schema";
import { getAllUsers, getCcsUserByUsername } from "../service/ccsUser.service";
import logger from "../utils/logger";

// eslint-disable-next-line import/prefer-default-export
export async function getUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.send(users);
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
export async function changeRoundHandler(
  req: Request<Record<string, never>, Record<string, never>, AdminPostInput>,
  res: Response
) {
  try {
    const user = await getCcsUserByUsername(req.body.username);
    user.round = req.body.round;
    user.save();
    return res.send("user round successfully saved");
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
