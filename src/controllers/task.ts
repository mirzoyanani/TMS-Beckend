import { Request, Response } from "express";
import { getResponseTemplate } from "../lib/index.js";
import { ResponseTemplate } from "../lib/index.js";
import jwt from "jsonwebtoken";
import { insertTask, getTasks, deleteTask, updateTask, updateTaskStatus } from "../db/task.js";
import { _TOKEN_IS_WRONG_ } from "../helpers/err-codes.js";

export const createTaskController = async (req: Request, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const payload = req.body;
    const { token } = req.headers;
    if (!token) {
      throw _TOKEN_IS_WRONG_;
    }

    const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY as string);

    insertTask(decoded, payload);
    result.data.message = "Task added successfully";
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};

export const getTasksController = async (req: Request, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    // const payload = req.body;
    const { token } = req.headers;
    if (!token) {
      throw _TOKEN_IS_WRONG_;
    }
    const decoded: any = jwt.verify(token as string, process.env.SECRET_KEY as string);
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const data = await getTasks(decoded, page, pageSize);

    result.data.items = data.tasks;
    result.data.pagination = {
      currentPage: page,
      totalPages: Math.ceil(data.totalCount / pageSize),
      totalCount: data.totalCount,
      pageSize,
    };
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};

export const deleteTaskController = async (req: Request, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    await deleteTask(parseInt(req.params.id));
    result.data.message = `task  with id-${req.params.id} deleted succesully`;
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};

export const updateTaskInfoController = async (req: Request, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const payload = req.body;

    await updateTask(payload.title, payload.description, payload.end_date, payload.id);

    result.data.message = `task  with id-${payload.id} updated  succesully`;
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};

export const updateTaskStatusController = async (req: Request, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const payload = req.body;

    if (payload.status == "todo" || payload.status == "in progress" || payload.status == "done") {
      await updateTaskStatus(payload.status, payload.id);
      result.data.message = `task  with id-${payload.id} updated  succesully`;
    } else {
      result.data.message = "Incorrect task  status value";
    }
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};
