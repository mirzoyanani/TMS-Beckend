import { Response, NextFunction } from "express";
import { ResponseTemplate, verifyToken } from "../lib/index.js";
import { getResponseTemplate } from "../lib/index.js";
import { CustomRequest } from "../lib/index.js";

export const authorize = (req: CustomRequest, res: Response, next: NextFunction) => {
  const result: ResponseTemplate = getResponseTemplate();
  const { token } = req.headers;

  if (!token) {
    return (result.data.message = "Token is missing");
  }

  try {
    const decoded = verifyToken<{ uid: string; code?: string }>(token as string);
    req.decoded = decoded;

    next();
  } catch (e) {
    const error = e as Error;
    return res.status(401).send("Authorization failed: " + error.message);
  }
};
