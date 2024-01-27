import { Response } from "express";
import { SignUpSchema } from "../lib/zod/schema";

export const checkUserCredentials = (username: string, password: string) => {
  return SignUpSchema.parse({ username, password });
};
