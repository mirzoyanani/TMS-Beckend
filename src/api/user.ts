import { Router } from "express";
import { getUserInfoController } from "../controllers/user.js";

const router: Router = Router();

router.get("", getUserInfoController);

export default router;
