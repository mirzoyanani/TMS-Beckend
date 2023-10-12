import { Router } from "express";
import { getTasksStatusController } from "../controllers/statistice.js";
const router: Router = Router();
import { authorize } from "../middlewares/authorization.js";
router.get("", authorize, getTasksStatusController);

export default router;
