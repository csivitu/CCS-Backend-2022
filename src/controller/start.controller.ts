import { Request, Response } from "express";
import moment from "moment";
import { getUser } from "../service/ccsUser.service";

export default async function startHandler(req: Request, res: Response) {
  const user = getUser(res.locals.user.username);
  const start: Date = new Date();
  const end: Date = moment(start).add(process.env.DURATION, "m").toDate();
  res.send(user);
}
