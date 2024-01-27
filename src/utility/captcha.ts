import { NextFunction, Request, Response } from "express";
import { CustomSessionData } from "../types/Session";

export const generateCaptcha = () => {
  const length = 6;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    captcha += characters[randomIndex];
  }
  return captcha;
};

export const generateCaptchaMiddlewar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const captcha = generateCaptcha();
  (req.session as CustomSessionData).captcha = captcha;
  return next();
};

export const checkCaptchaMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const enteredCaptcha = req.body.captcha;
  const storedCaptcha = (req.session as CustomSessionData).captcha;

  if (enteredCaptcha === storedCaptcha) {
    return next();
  } else {
    res.status(400).json({ error: "Captcha verification failed" });
  }
};
