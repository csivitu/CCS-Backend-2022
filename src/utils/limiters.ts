import config from "config";
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.get("enviornment") === "production" ? 250 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
});

export const quizLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.get("enviornment") === "production" ? 600 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
});

export const createAccountLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: config.get("enviornment") === "production" ? 10 : 10000,
  message:
    "Too many accounts created from this IP, please try again after some time",
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: config.get("enviornment") === "production" ? 10 : 10000,
  message:
    "Too many attempts to reset password from this IP, please try again after some time",
  standardHeaders: true,
  legacyHeaders: false,
});

export const emailVerifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: config.get("enviornment") === "production" ? 10 : 10000,
  message:
    "Too many attempts to send verification mail from this IP, please try again after some time",
  standardHeaders: true,
  legacyHeaders: false,
});
