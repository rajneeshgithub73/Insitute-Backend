import { Router } from "express";
import {
  getCurrentStudent,
  loginStudent,
  logoutStudent,
  refreshAccessToken,
  registerStudent,
  updateProfile,
} from "../controllers/student.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyStudentJWT } from "../middlewares/studentAuth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerStudent);
router.route("/login").post(loginStudent);
router.route("/refresh").get(refreshAccessToken);
router.route("/get").get(verifyStudentJWT, getCurrentStudent);
router.route("/logout").post(verifyStudentJWT, logoutStudent);
router.route("/update").post(verifyStudentJWT, updateProfile);

export default router;
