import { Request, Response } from "express";
import { AdminPostInput } from "../schema/adminPost.schema";
import { getAllUsers, getCcsUserByUsername } from "../service/ccsUser.service";
import errorObject from "../utils/errorObject";
import logger from "../utils/logger";

export async function getUsersHandler(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.send(errorObject(200, "", users));
  } catch (e) {
    logger.error(e);
    return res.status(404).send(errorObject(404, e));
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
    return res.send(errorObject(200, "user round successfully saved"));
  } catch (e) {
    logger.error(e);
    return res.status(404).send(errorObject(404, e));
  }
}
