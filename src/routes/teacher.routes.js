import { Router } from "express";
import {
  getCurrentTeacher,
  loginTeacher,
  logoutTeacher,
  refreshAccessToken,
  registerTeacher,
  updateProfile,
} from "../controllers/teacher.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyTeacherJWT } from "../middlewares/teacherAuth.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router();
router
  .route("/register")
  .post(
    upload.single("avatar"),
    verifyTeacherJWT,
    verifyAdminJWT,
    registerTeacher
  );
router.route("/login").post(loginTeacher);
router.route("/refresh").get(refreshAccessToken);
router.route("/get").get(verifyTeacherJWT, getCurrentTeacher);
router.route("/logout").post(verifyTeacherJWT, logoutTeacher);
router.route("/update").post(verifyTeacherJWT, updateProfile);

export default router;
