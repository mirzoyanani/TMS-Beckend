import { Router } from "express";
import {
  registerController,
  loginController,
  forgetPasswordController,
  checkCodeController,
  resetPasswordController,
} from "../controllers/auth.js";
import validator from "../middlewares/validator/index.js";
import filleMiddleware from "../middlewares/multer.js";
const router: Router = Router();

router.post("/register", filleMiddleware.single("profilePicture"), validator("register"), registerController);
router.post("/login", validator("login"), loginController);
router.post("/forgetPassword", forgetPasswordController);
router.post("/submitCode", checkCodeController);
router.put("/resetPassword", validator("reset_password"), resetPasswordController);

export default router;
