import express from "express";

const authRouter = express.Router();

export const login = authRouter.get("/", (req, res) => {
  res.json({ test: true });
});
