import express from "express";
import { login } from "./auth/login";
import { signupRouter } from "./auth/signup";
import { editUser } from "./user/editUser";

const apiRouter = express.Router();

apiRouter.use("/auth", login, signupRouter);

apiRouter.use("/users", editUser);

export default apiRouter;
