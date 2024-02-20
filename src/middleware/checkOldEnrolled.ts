import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import errorObject from "../utils/errorObject";
import { UserInput } from "../models/user.model";
import logger from "../utils/logger";
import { getCcsUserEmail } from "../service/ccsUser.service";

function isStringPresentInJsonFile(
  targetString: string,
  path: string
): boolean {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync(path, "utf-8"));

    // Check if the targetString is present in the array
    return Array.isArray(jsonData) && jsonData.includes(targetString);
  } catch (error) {
    logger.error(error);
    return false;
  }
}

const checkOldEnrolled = async (
  req: Request<Record<string, never>, Record<string, never>, UserInput>,
  res: Response,
  next: NextFunction
) => {
  let { email } = req.body;

  if (email === undefined) {
    const { user } = res.locals;

    if (!user) {
      return res.status(200).send(errorObject(403, "not logged in"));
    }
    email = await getCcsUserEmail(user._id);
  }

  if (isStringPresentInJsonFile(email, "adminlist.json")) {
    return next();
  }

  const universityEmailRegex =
    /^[a-zA-Z]+\.([a-zA-Z]+\.)?[a-zA-Z]*(20(20|21|22|23))[a-z]*@vitstudent\.ac\.in$/;

  if (!universityEmailRegex.test(email)) {
    return res.status(200).send(errorObject(403, "Not an Vit Email id"));
  }

  // if (email.match(universityEmailRegex)[2] !== "2023") {
  //   return res.status(200).send(errorObject(403, "Not a Fresher"));
  // }
  console.log("email", email);
  if (!isStringPresentInJsonFile(email, "enrolledoldlist.json")) {
    return res.status(200).send(errorObject(403, "Not enrolled in CSI"));
  }
  console.log("didnt reach here");

  return next();
};

export default checkOldEnrolled;
