import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentTeacher,
  loginTeacher,
  logoutTeacher,
  refreshAccessToken,
} from "../controllers/teacher.controllers.js";
import { verifyTeacherJWT } from "../middlewares/teacherAuth.middleware.js";

const router = Router();

router.route("/login").post(loginTeacher);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/get-teacher").get(verifyTeacherJWT, getCurrentTeacher);
router.route("/logout").post(verifyTeacherJWT, logoutTeacher);
router.route("/change-password").post(verifyTeacherJWT, changeCurrentPassword);

export default router;
