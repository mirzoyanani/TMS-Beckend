import { getResponseTemplate, ResponseTemplate, hashingString, sendEmail } from "../lib/index.js";
import { v4 as uuid } from "uuid";
// import db from "../db/index.js";
import { Request, Response } from "express";
import { _WRONG_LOGIN_OR_PASSWORD, _TOKEN_IS_WRONG_, _RESET_CODE_IS_WRONG_ } from "../helpers/err-codes.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerUser, getCurrentUserByEmailorId, updatePassword } from "../db/auth.js";

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

    const currentUser = await getCurrentUserByEmailorId(payload.email, undefined);

    if (!currentUser) {
      throw _WRONG_LOGIN_OR_PASSWORD;
    }

    const compare = await bcrypt.compare(payload.password, currentUser.password);

    if (!compare) {
      throw _WRONG_LOGIN_OR_PASSWORD;
    }

    const token = jwt.sign({ uid: currentUser.uid }, process.env.SECRET_KEY as string, {
      expiresIn: 60 * 60 * 24 * 365,
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

export const forgetPasswordController = async (req: Request, res: Response): Promise<void> => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const payload = req.body;
    const currentUser = await getCurrentUserByEmailorId(payload.email, undefined);

    if (!currentUser) {
      throw { status: 401, message: "Այսպիսի օգտատեր գոյություն չունի" };
    }

    const randomCode = Math.floor(Math.random() * (100000 - 999999 + 1)) + 999999;

    const codeForJwt = await hashingString(randomCode.toString());

    const token = jwt.sign(
      {
        uid: currentUser.uid,
        code: codeForJwt,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: 60 * 60 * 24 * 365 },
    );

    await sendEmail(req.body.email, "RESET CODE", randomCode);

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
export const checkCodeController = async (req: Request, res: Response): Promise<void> => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const { token } = req.headers;
    if (!token) {
      throw _TOKEN_IS_WRONG_;
    }

    const { code } = req.body;

    const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY as string);

    const compared = await bcrypt.compare(code, decoded.code);

    if (!compared) {
      throw _RESET_CODE_IS_WRONG_;
    }
    const currentUser = await getCurrentUserByEmailorId(undefined, decoded.uid);

    if (!currentUser) {
      throw { status: 406, message: "Wrong params" };
    }

    const newToken = jwt.sign(
      {
        uid: currentUser.uid,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: 60 * 60 * 24 * 365 },
    );

    result.data.token = newToken;
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 5000,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }

  res.status(result.meta.status).json(result);
};

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const token = req.headers.token;
    if (!token) {
      throw _TOKEN_IS_WRONG_;
    }

    const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY as string);

    const newPassword = await hashingString(req.body.password);
    updatePassword(newPassword, decoded.uid);

    result.data.message = "Request has ended successfully";
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 5000,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }

  res.status(result.meta.status).json(result);
};
