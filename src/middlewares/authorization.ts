import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  decoded?: object;
}

export const authorize = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).send("Token is missing");
  }

  try {
    const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY as string);
    req.decoded = decoded;

    next();
  } catch (error) {
    return res.status(401).send("Authorization failed: " + (error as Error).message);
  }
};
