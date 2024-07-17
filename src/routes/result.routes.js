import { Router } from "express";
import { addResult, filterResult } from "../controllers/result.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyTeacherJWT } from "../middlewares/teacherAuth.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router
  .route("/add")
  .post(upload.single("avatar"), verifyTeacherJWT, verifyAdminJWT, addResult);
router.route("/filter").get(filterResult);

export default router;
