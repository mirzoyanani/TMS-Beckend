import { Response } from "express";
import { getResponseTemplate } from "../lib/index.js";
import { ResponseTemplate } from "../lib/index.js";
import {
  insertTask,
  getTasks,
  deleteTask,
  updateTask,
  updateTaskStatus,
  filterTasksbyStatus,
  filterTasksbyDateController,
  getTasksByTitle,
} from "../db/task.js";
import { CustomRequest, returnResult, TaskCreationDTO } from "../lib/index.js";

export const createTaskController = async (req: CustomRequest<TaskCreationDTO, unknown>, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const payload = req.body;
    if (req.decoded?.uid) {
      await insertTask(req.decoded.uid, payload);
    }
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
interface TaskDeleteDTO {
  id: string;
}
export const deleteTaskController = async (req: CustomRequest<unknown, TaskDeleteDTO>, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  const payload = req.params;
  try {
    await deleteTask(parseInt(payload.id));
    result.data.message = `task  with id-${payload.id} deleted succesully`;
  } catch (err: any) {
    result.meta.error = {
      code: err.code || err.errCode || 500,
      message: err.message || err.errMessage || "Unknown Error",
    };
    result.meta.status = err.status || err.statusCode || 500;
  }
  res.status(result.meta.status).json(result);
};
interface TaskUpdateDTO {
  id: number;
  title: string;
  description: string;
  end_date: string;
}
export const updateTaskInfoController = async (req: CustomRequest<TaskUpdateDTO, unknown>, res: Response) => {
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
interface TaskStatusUpdateDTO {
  status: "todo" | "in progress" | "done";
  id: number;
}
export const updateTaskStatusController = async (req: CustomRequest<TaskStatusUpdateDTO, unknown>, res: Response) => {
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

export const getTasksController = async (req: CustomRequest, res: Response) => {
  const result: ResponseTemplate = getResponseTemplate();
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const orderBY = req.query.date as string;
    const searchValue = req.query.query as string;
    const status = req.query.status as string;

    if (req.decoded) {
      if (status && !orderBY) {
        if (status == "todo" || status == "in progress" || status == "done") {
          const data = await filterTasksbyStatus(req.decoded.uid, page, pageSize, status);
          returnResult(result, data, page, pageSize);
        } else {
          result.data.message = "Invalid status type";
        }
      } else if (searchValue && !orderBY) {
        const data = await getTasksByTitle(req.decoded.uid, page, pageSize, searchValue);

        returnResult(result, data, page, pageSize);
      } else if (orderBY) {
        if (orderBY == "ASC" || orderBY == "DESC") {
          if (status) {
            const data = await filterTasksbyDateController(req.decoded.uid, page, pageSize, status, "", orderBY);

            returnResult(result, data, page, pageSize);
          } else if (searchValue) {
            const data = await filterTasksbyDateController(req.decoded.uid, page, pageSize, "", searchValue, orderBY);

            returnResult(result, data, page, pageSize);
          } else {
            const data = await filterTasksbyDateController(req.decoded.uid, page, pageSize, "", "", orderBY);
            returnResult(result, data, page, pageSize);
          }
        } else {
          result.data.message = "Invalid orderBy type";
        }
      } else {
        const data = await getTasks(req.decoded.uid, page, pageSize);

        returnResult(result, data, page, pageSize);
      }
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
