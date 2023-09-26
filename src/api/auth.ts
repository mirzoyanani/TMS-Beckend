import { Router } from "express";
import { registerController, loginController } from "../controllers/auth.js";
import validator from "../middlewares/validator/index.js";
import filleMiddleware from "../middlewares/multer.js";
const router: Router = Router();

router.post("/register", filleMiddleware.single("profilePicture"), validator("register"), registerController);
router.post("/login", loginController);

export default router;
