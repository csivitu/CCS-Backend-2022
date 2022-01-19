import { Request, Response } from "express";
import { CreateAdminInput } from "../schema/admin.schema";
import logger from "../utils/logger";

// eslint-disable-next-line import/prefer-default-export
export async function getUsersHandler(
  req: Request<
    Record<string, never>,
    Record<string, never>,
    CreateAdminInput["body"]
  >,
  res: Response
) {
  try {
    const Admin = await createAdmin(req.body);
    return res.send(Admin);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
