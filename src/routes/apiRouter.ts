import express from "express";
import { login } from "./auth/login";
import { signupRouter } from "./auth/signup";
import { editUser } from "./user/editUser";
import { generateCaptchaMiddlewar } from "../utility/captcha";

const apiRouter = express.Router();

apiRouter.use("/auth", login, signupRouter);

apiRouter.use("/user", editUser);

export default apiRouter;
