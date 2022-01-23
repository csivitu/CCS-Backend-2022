import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const createAccountLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message:
    "Too many accounts created from this IP, please try again after some time",
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message:
    "Too many attempts to reset password from this IP, please try again after some time",
  standardHeaders: true,
  legacyHeaders: false,
});

export const emailVerifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message:
    "Too many attempts to send verification mail from this IP, please try again after some time",
  standardHeaders: true,
  legacyHeaders: false,
});
