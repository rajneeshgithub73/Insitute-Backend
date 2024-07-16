import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentTeacher,
  loginTeacher,
  logoutTeacher,
  refreshAccessToken,
  registerTeacher,
} from "../controllers/teacher.controllers.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.route("/register").post(upload.single("avatar"), registerTeacher)
router.route("/login").post(loginTeacher);
router.route("/refresh-token").get(refreshAccessToken);

import { verifyTeacherJWT } from "../middlewares/teacherAuth.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

router.route("/get-teacher").get(verifyTeacherJWT, getCurrentTeacher);
router.route("/logout").post(verifyTeacherJWT, logoutTeacher);
router.route("/change-password").post(verifyTeacherJWT, changeCurrentPassword);

export default router;
