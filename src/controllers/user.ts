import { Response } from "express";
import { getResponseTemplate } from "../lib/index.js";
import { ResponseTemplate } from "../lib/index.js";
import { CustomRequest } from "../lib/index.js";
import { getUserInfo, updateUserInfo } from "../db/user.js";

export const getUserInfoController = async (req: CustomRequest, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const data = await getUserInfo(req.decoded);
    result.data = { data };
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};

export const updateUserInfoController = async (req: CustomRequest, res: Response) => {
  const result = getResponseTemplate();
  try {
    const payload = req.body;
    if (!payload.profilePicture) {
      payload.profilePicture = req.file?.filename;
    }
    await updateUserInfo(req.decoded, payload);
    res.status(200).json(result);
  } catch (error: any) {
    result.meta.error = {
      code: error.code || error.errCode || 500,
      message: error.message || error.errMessage || "Unknown Error",
    };
    result.meta.status = error.status || error.statusCode || 500;

    res.status(result.meta.status).json(result);
  }
};
