import "dotenv/config";
import express from "express";
import apiRouter from "./routes/apiRouter";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/test", (req, res) => {
  res.send("Service is up and running...!");
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
