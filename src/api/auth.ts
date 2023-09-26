import { Router } from "express";
import { registerController } from "../controllers/auth.js";
import validator from "../middlewares/validator/index.js";
const router: Router = Router();

router.post("/register", validator("register"), registerController);

export default router;
