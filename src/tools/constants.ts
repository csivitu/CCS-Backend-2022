export const constants = {
  vitEmailRegex:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((vitstudent.ac.in)|(vit.ac.in))$/,
  emailRegex:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  // mobileRegex: /[\s\S]*/, // match anything because i gave up coming up with a generic regex
  passwordRegex: /^[a-zA-Z0-9`!@#$%^&*()-/:'.,{}_"~]{8,50}$/, // 8-50 characters,
  regNoRegex: /^\d\d[A-Z]{3}[0-9]{4}$/,
  usernameRegex: /^[a-zA-Z0-9`!@#$%^&*()-/:'.,{}_"~]{3,20}$/,

  defaultResponse: "defaultResponse",

  home: "homePage",

  serverError: "serverError",

  invalidUsername: "invalidUsername",
  invalidEmail: "invalidEmail",
  invalidMobile: "invalidMobile",
  invalidPassword: "invalidPassword",
  invalidRegNo: "invalidRegNo",
  incorrectDetails: "incorrectDetails",

  participantNotFound: "participantNotFound",
  duplicate: "duplicate",
  loginSuccess: "loginSuccess",
  logoutSuccess: "logoutSuccess",
  maxFieldLengthExceeded: "maxFieldLengthExceeded",
  adminLoginSuccess: "adminLoginSuccess",
  adminLogoutSuccess: "adminLogoutSuccess",
  recaptchaFailed: "recaptchaFailed",

  registrationSuccess: "registrationSuccess",
  notVerified: "notVerified",
  emailAlreadySent: "emailAlreadySent",

  questionAdded: "questionAdded",
  passwordResetMail: "passwordResetMailSent",
  passwordResetSuccess: "passwordResetSuccess",

  sendResetMailSubject: "Reset your CSI Account Password",
  sendVerificationMailSubject: "Verify your CSI Account",
  verificationSuccess: "verificationSuccess",

  techAutosavedMessage: "Your answers are being autosaved.",
  managementAutosavedMessage: "Your answers are being autosaved.",
  designAutosavedMessage: "Your answers are being autosaved.",
  videoAutosavedMessage: "Your answers are being autosaved.",
};

export default constants;
