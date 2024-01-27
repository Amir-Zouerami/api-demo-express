import express from "express";
import { login } from "./auth/login";

const apiRouter = express.Router();

apiRouter.use("/auth", login);

export default apiRouter;
