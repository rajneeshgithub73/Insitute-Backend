import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentStudent,
  loginStudent,
  logoutStudent,
  refreshAccessToken,
  registerStudent,
} from "../controllers/student.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyStudentJWT } from "../middlewares/studentAuth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerStudent);
router.route("/login").post(loginStudent);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/get-student").get(verifyStudentJWT, getCurrentStudent);
router.route("/logout").post(verifyStudentJWT, logoutStudent);
router.route("/change-password").post(verifyStudentJWT, changeCurrentPassword);

export default router;
