import express from "express";
import MySQLClient from "../../lib/mysql/MySQLClient";
import { validateJwtToken } from "../../lib/jwt/checkToken";
import { checkUserCredentials } from "../../utility/checkUserCredentials";
import { hashPassword } from "../../utility/hashPassword";

const userRouter = express.Router();

export const editUser = userRouter.patch("/edit/:id", async (req, res) => {
  const userId = req.params.id;
  const authHeader = req.headers["authorization"];

  if (authHeader && userId) {
    const token = authHeader.split(" ")[1];
    const tokenValidity = validateJwtToken(token);
    const { username, password } = req.body;

    try {
      checkUserCredentials(username, password);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "body is not formatted correctly." });
    }

    if (!tokenValidity) {
      return res.status(401).json({ error: "Unauthorized! token is invalid." });
    }

    // const payload = JSON.parse(base64UrlDecode(token.split(".")[1]));
    const hashedPassword = hashPassword(password);

    try {
      const queryRes = await MySQLClient.getInstance().setQuery(
        "UPDATE users SET username = ?, password = ? WHERE id = ?",
        [username, hashedPassword, userId]
      );

      console.log(queryRes);

      if (queryRes.affectedRows > 0) {
        return res.status(200).json({ ok: "done", message: "user edited..." });
      } else {
        return res.status(304).json({ error: "no rows were modified." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
    // // console.log("AAAAAAAAA", payload);
    // return res.status(200).json({ ok: "done", userId, payload });
  } else {
    return res
      .status(401)
      .json({ error: "Unauthorized! No token in authorization header." });
  }
});
