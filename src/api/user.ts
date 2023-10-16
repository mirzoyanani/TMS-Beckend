import { Router } from "express";
import { getUserInfoController, updateUserInfoController } from "../controllers/user.js";
import { authorize } from "../middlewares/authorization.js";
import filleMiddleware from "../middlewares/multer.js";
const router: Router = Router();

router.get("", authorize, getUserInfoController);
router.put("", authorize, filleMiddleware.single("profilePicture"), updateUserInfoController);

export default router;
