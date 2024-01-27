import express from "express";
import MySQLClient from "../../lib/mysql/MySQLClient";
import { base64UrlDecode, validateJwtToken } from "../../lib/jwt/checkToken";
import { checkUserCredentials } from "../../utility/checkUserCredentials";
import { hashPassword } from "../../utility/hashPassword";

const userRouter = express.Router();

export const editUser = userRouter.patch("/", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { currentPassword } = req.body;

  if (authHeader && currentPassword) {
    const { username, password } = req.body;

    try {
      checkUserCredentials(username, password);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "body is not formatted correctly." });
    }

    const token = authHeader.split(" ")[1];
    const tokenValidity = validateJwtToken(token);

    if (!tokenValidity) {
      return res.status(401).json({ error: "Unauthorized! token is invalid." });
    }

    const payload = JSON.parse(base64UrlDecode(token.split(".")[1]));
    const hashedPassword = hashPassword(password);
    const currentHashedPass = hashPassword(currentPassword);

    const queryRes = await MySQLClient.getInstance().getQuery(
      "SELECT * FROM users WHERE id = ? AND password = ?",
      [payload.sub, currentHashedPass]
    );

    if (queryRes.length < 0) {
      return res
        .status(401)
        .json({ error: "the current password is incorrect" });
    }

    try {
      const queryRes = await MySQLClient.getInstance().setQuery(
        "UPDATE users SET username = ?, password = ? WHERE id = ?",
        [username, hashedPassword, payload.sub]
      );

      if (queryRes.affectedRows > 0) {
        return res.status(200).json({ ok: "done", message: "user edited..." });
      } else {
        return res.status(304).json({ error: "no rows were modified." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    return res
      .status(401)
      .json({ error: "Unauthorized! No token in authorization header." });
  }
});
