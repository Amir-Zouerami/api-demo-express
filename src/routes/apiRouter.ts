import express from "express";
import { login } from "./auth/login";
import { signupRouter } from "./auth/signup";

const apiRouter = express.Router();

apiRouter.use("/auth", login, signupRouter);

export default apiRouter;
