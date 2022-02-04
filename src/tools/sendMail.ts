import formData from "form-data";
import Mailgun from "mailgun.js";
import config from "config";
import url from "url";
import { create } from "express-handlebars";
import { constants } from "./constants";
import { UserDocument } from "../models/user.model";
import logger from "../utils/logger";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: config.get<string>("mailgun_api_key"),
  url: config.get<string>("mailgun_host"),
});
const senderEmail = config.get<string>("sender_email");
const domain = config.get<string>("email_domain");

export const sendMail = async (
  email: string,
  subject: string,
  content: string,
  link: string
) => {
  try {
    const data = {
      from: `CSI-VIT <${senderEmail}>`,
      to: email,
      subject,
      text: link,
      html: content,
    };
    await mg.messages.create(domain, data);
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
  verifyLink.pathname = `${verifyLink.pathname}/${participant.emailVerificationToken}/${participant._id}`;
  const renderedHtml = await hb.render("src/templates/verify.hbs", {
    name: participant.name,
    verifyLink: verifyLink.href,
  });
  await sendMail(
    participant.email,
    constants.sendVerificationMailSubject,
    renderedHtml,
    verifyLink.href
  );
};
export const sendResetPasswordMail = async (participant: UserDocument) => {
  const resetLink = new url.URL(config.get("reset_link"));
  resetLink.searchParams.append("id", participant._id);
  resetLink.searchParams.append("token", participant.passwordResetToken);
  const renderedHtml = await hb.render("src/templates/reset.hbs", {
    name: participant.name,
    username: participant.username,
    resetLink: resetLink.href,
  });
  await sendMail(
    participant.email,
    constants.sendResetMailSubject,
    renderedHtml,
    resetLink.href
  );
};

export default { sendMail, sendVerificationMail };
