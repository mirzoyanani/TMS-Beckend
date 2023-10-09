import { Router } from "express";
import { getTasksStatusController } from "../controllers/statistice.js";
const router: Router = Router();

router.get("", getTasksStatusController);

export default router;
