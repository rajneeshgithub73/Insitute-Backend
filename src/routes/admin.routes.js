import { Router } from "express";
import {
  filterStudents,
  deleteStudent,
  toggleVerifyStudent,
  updatePassword
} from "../controllers/admin.controllers.js";
import { verifyTeacherJWT } from "../middlewares/teacherAuth.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = new Router();

router
  .route("/student/filter")
  .get(verifyTeacherJWT, verifyAdminJWT, filterStudents);
router
  .route("/student/verify/:id")
  .get(verifyTeacherJWT, verifyAdminJWT, toggleVerifyStudent);
router
  .route("/user/password")
  .patch(verifyTeacherJWT, verifyAdminJWT, updatePassword);
router
  .route("/student/delete/:id")
  .delete(verifyTeacherJWT, verifyAdminJWT, deleteStudent);

export default router;
