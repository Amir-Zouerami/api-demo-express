import "dotenv/config";
import express from "express";
import apiRouter from "./routes/apiRouter";

const app = express();
const port = process.env.PORT;

app.get("/test", (req, res) => {
  res.send("Service is up and running...!");
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
