import { Request, Response } from "express";
import { getResponseTemplate } from "../lib/index.js";
import { ResponseTemplate } from "../lib/index.js";
import jwt from "jsonwebtoken";
import { _TOKEN_IS_WRONG_ } from "../helpers/err-codes.js";
import { getStatistics } from "../db/statistics.js";
export const getTasksStatusController = async (req: Request, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const { token } = req.headers;
    if (!token) {
      throw _TOKEN_IS_WRONG_;
    }
    const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY as string);

    const data = await getStatistics(decoded);

    result.data.items = data.statuses;
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};
