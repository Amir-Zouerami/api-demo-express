import { Response } from "express";
import { SignUpSchema } from "../lib/zod/schema";

export const checkUserCredentials = (
  username: string,
  password: string,
  res: Response<any, Record<string, any>>
) => {
  return SignUpSchema.parse({ username, password });
};
