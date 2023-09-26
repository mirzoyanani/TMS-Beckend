import { getResponseTemplate, ResponseTemplate, hashingString } from "../lib/index.js";
import { v4 as uuid } from "uuid";
// import db from "../db/index.js";
import { Request, Response } from "express";
import { _WRONG_LOGIN_OR_PASSWORD } from "../helpers/err-codes.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerUser, getCurrentUserByEmail } from "../db/auth.js";

export const registerController = async (req: Request, res: Response): Promise<void> => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const payload = req.body;
    payload.uid = uuid();
    payload.img = req.file?.filename;
    payload.password = await hashingString(payload.password);
    registerUser(payload);
    result.data.message = "User registered successfully";
  } catch (err: any) {
    result.meta.error = {
      code: err.code || 500,
      message: err.message || "Unknown Error",
    };
    result.meta.status = err.status || 500;
  }

  res.status(result.meta.status).json(result);
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const result: ResponseTemplate = getResponseTemplate(); // Modify this according to your response structure
  try {
    const payload = req.body;

    const currentUser = await getCurrentUserByEmail(payload.email);

    if (!currentUser) {
      throw _WRONG_LOGIN_OR_PASSWORD;
    }

    const compare = await bcrypt.compare(payload.password, currentUser.password);

    if (!compare) {
      throw _WRONG_LOGIN_OR_PASSWORD;
    }

    const token = jwt.sign({ uid: currentUser.uid }, process.env.SECRET_KEY as string, {
      expiresIn: "1y",
    });

    result.data.token = token;
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 5000,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }

  res.status(result.meta.status).json(result);
};
