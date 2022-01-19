import axios from "axios";
import config from "config";
// import rp from "request-promise";
import url from "url";
import hbs from "express-handlebars";
import { constants } from "./constants";
import { UserInput } from "../models/user.model";

const hb = hbs.create({
  extname: ".hbs",
  partialsDir: ".",
});

const { SENGRID_API_KEY } = config.get("API_KEY");

const sendMail = async (email: string, subject: string, content: string) => {
  try {
    await axios.post("https://emailer-api.csivit.com/email", {
      html: content,
      subject,
      to: email,
      auth: SENGRID_API_KEY,
    });
    console.log(`Mail sent to ${email} successfully`);
  } catch (e) {
    console.log(e);
  }
};

export const sendVerificationMail = async (participant: UserInput) => {
  const verifyLink = new url.URL(process.env.VERIFY_LINK);
  verifyLink.searchParams.append("token", participant.emailVerificationToken);
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

// export const verifyRecaptcha = async (response: string) => {
//   const recaptcha = await rp({
//     method: "POST",
//     uri: "https://www.google.com/recaptcha/api/siteverify",
//     form: {
//       secret: process.env.RECAPTCHA_SECRET,
//       response,
//     },
//     json: true,
//   });
//   return recaptcha.success === true;
// };

export default { sendMail, sendVerificationMail };
