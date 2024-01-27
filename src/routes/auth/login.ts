import { checkUserCredentials } from "../../utility/checkUserCredentials";
import { hashPassword } from "../../utility/hashPassword";
import { createJWT } from "../../lib/jwt/generateToken";
import MySQLClient from "../../lib/mysql/MySQLClient";
import { User } from "../../types/User";
import express from "express";

const authRouter = express.Router();

export const login = authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    checkUserCredentials(username, password, res);
  } catch (error) {
    return res.status(400).json({
      error:
        "validation failed. Check username must be an email and password must contain at least 8 characters",
    });
  }

  const hashedPassword = hashPassword(password);

  try {
    const queryRes = await MySQLClient.getInstance().getQuery<User>(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, hashedPassword]
    );

    if (queryRes && queryRes.length === 1) {
      const user = queryRes[0];

      const payload = {
        sub: user.id,
        username: user.username,
      };

      const jwt = createJWT(payload);

      res.status(200).json({ token: jwt });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
