import { checkUserCredentials } from "../../utility/checkUserCredentials";
import { createJWT } from "../../lib/jwt/generateToken";
import MySQLClient from "../../lib/mysql/MySQLClient";
import express from "express";
import crypto from "crypto";

export const signupRouter = express.Router();

export const signup = signupRouter.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    checkUserCredentials(username, password, res);
  } catch (error) {
    return res.status(400).json({
      error:
        "validation failed. Check username must be an email and password must contain at least 8 characters",
    });
  }

  try {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    try {
      const queryRes = await MySQLClient.getInstance().setQuery(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword]
      );

      if (queryRes.affectedRows === 1) {
        const jwt = createJWT({ sub: queryRes.insertId, username });
        res.status(201).json({ message: "Signup successful", token: jwt });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (error: any) {
      if ("code" in error && error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "username already exists." });
      }

      return res.status(500).json({ error: "Internal Server Error." });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
