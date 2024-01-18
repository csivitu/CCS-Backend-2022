import formData from "form-data";
import Mailgun from "mailgun.js";
import config from "config";
import url from "url";
import { create } from "express-handlebars";
import https from "https";
// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from "aws-sdk";
import { constants } from "./constants";
import { UserDocument } from "../models/user.model";
import logger from "../utils/logger";

const SES_CONFIG = {
  accessKeyId: config.get<string>("access_key"),
  secretAccessKey: config.get<string>("secret_key"),
  region: "ap-south-1",
};

const ses = new AWS.SES(SES_CONFIG);
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
    // const data = {
    //   from: senderEmail,
    //   to: email,
    //   text: link,
    //   subject,
    //   html: content,
    // };

    const params = {
      Source: "Team CSI <askcsivit@gmail.com>",
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: content,
          },
        },
      },
    };
    await ses.sendEmail(params).promise();

    // const postOptions = {
    //   host: config.get<string>("emailer_host"),
    //   port: "443",
    //   path: config.get<string>("emailer_path"),
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Content-Length": Buffer.byteLength(JSON.stringify(data)),
    //   },
    // };

    // Set up the request
    // const postReq = https.request(postOptions, (res) => {
    //   res.setEncoding("utf8");
    //   res.on("data", (chunk) => {
    //     logger.info(`mail sent to ${email} Response: `, chunk);
    //   });
    // });

    // post the data
    // postReq.write(JSON.stringify(data));
    // postReq.end();
    // await mg.messages.create(domain, data);
    // console.log(data);
    // await mg.messages.create(domain, data);
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
