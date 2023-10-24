import { Router } from "express";
import {
  createTaskController,
  getTasksController,
  deleteTaskController,
  updateTaskInfoController,
  updateTaskStatusController,
} from "../controllers/task.js";
import validator from "../middlewares/validator/index.js";
const router: Router = Router();

router.post("", validator("task"), createTaskController);
router.get("", getTasksController);
router.delete("/:id", deleteTaskController);
router.put("", validator("update"), updateTaskInfoController);
router.put("/status", updateTaskStatusController);

export default router;
