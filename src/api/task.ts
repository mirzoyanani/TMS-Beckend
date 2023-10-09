import { Router } from "express";
import {
  createTaskController,
  getTasksController,
  deleteTaskController,
  updateTaskInfoController,
  updateTaskStatusController,
  getTasksByStatusController,
  getTasksByDateController,
  getTasksByTitleController,
} from "../controllers/task.js";
import validator from "../middlewares/validator/index.js";
const router: Router = Router();

router.post("", createTaskController);
router.get("", getTasksController);
router.delete("/:id", deleteTaskController);
router.put("", validator("update"), updateTaskInfoController);
router.put("/status", updateTaskStatusController);
router.get("/status", getTasksByStatusController);
router.get("/date", getTasksByDateController);
router.get("/search", getTasksByTitleController);
export default router;
