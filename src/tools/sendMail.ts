import axios from "axios";
import config from "config";
import url from "url";
import { create } from "express-handlebars";
import { constants } from "./constants";
import { UserDocument } from "../models/user.model";
import logger from "../utils/logger";

const emailerApiKey = config.get("emailer_api_key");

export const sendMail = async (
  email: string,
  subject: string,
  content: string
) => {
  try {
    await axios.post("http://localhost:5001/email", {
      html: content,
      subject,
      to: email,
      auth: emailerApiKey,
    });
    logger.info(`Mail sent to ${email} successfully`);
  } catch (e) {
    logger.error(e);
  }
};

const hb = create({
  extname: ".hbs",
});
export const sendVerificationMail = async (participant: UserDocument) => {
  const verifyLink = new url.URL(config.get("verify_link"));
  verifyLink.searchParams.append("token", participant.emailVerificationToken);
  verifyLink.searchParams.append("user", participant._id);
  const renderedHtml = await hb.render("src/templates/verify.hbs", {
    name: participant.name,
    verifyLink: verifyLink.href,
  });
  await sendMail(
    participant.email,
    constants.sendVerificationMailSubject,
    renderedHtml
  );
};

export default { sendMail, sendVerificationMail };
