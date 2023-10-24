import { Router } from "express";
import { getUserInfoController, updateUserInfoController } from "../controllers/user.js";
import { authorize } from "../middlewares/authorization.js";
import filleMiddleware from "../middlewares/multer.js";
import validator from "../middlewares/validator/index.js";
const router: Router = Router();

router.get("", authorize, getUserInfoController);
router.put("", authorize, filleMiddleware.single("profilePicture"), validator("info_update"), updateUserInfoController);

export default router;
