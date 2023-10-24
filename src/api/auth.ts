import { Router } from "express";
import {
  registerController,
  loginController,
  forgetPasswordController,
  checkCodeController,
  resetPasswordController,
} from "../controllers/auth.js";
import validator from "../middlewares/validator/index.js";
import fileMiddleware from "../middlewares/multer.js";
import { authorize } from "../middlewares/authorization.js";
const router: Router = Router();

router.post("/register", fileMiddleware.single("profilePicture"), validator("register"), registerController);
router.post("/login", validator("login"), loginController);
router.post("/forgetPassword", validator("forget_password"), forgetPasswordController);
router.post("/submitCode", authorize, validator("check_code"), checkCodeController);
router.put("/resetPassword", authorize, validator("reset_password"), resetPasswordController);

export default router;
