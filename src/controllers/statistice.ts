import { Response } from "express";
import { getResponseTemplate } from "../lib/index.js";
import { ResponseTemplate } from "../lib/index.js";
import { getStatistics } from "../db/statistics.js";
import { CustomRequest } from "../lib/index.js";
export const getTasksStatusController = async (req: CustomRequest, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const data = await getStatistics(req.decoded);
    result.data.items = data.statuses;
    result.data.statusCounts = data.dataCount;
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};
