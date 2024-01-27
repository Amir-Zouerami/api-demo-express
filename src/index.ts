import { generateCaptcha } from "./utility/captcha";
import { CustomSessionData } from "./types/Session";
import apiRouter from "./routes/apiRouter";
import session from "express-session";
import bodyParser from "body-parser";
import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.session_secret as string,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/captcha", (req, res) => {
  const captcha = generateCaptcha();
  (req.session as CustomSessionData).captcha = captcha;
  res.send(captcha);
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
