import { Router } from "express";
import {
  filterStudents,
  deleteStudent,
  toggleVerifyStudent,
  updateStudentPassword,
  updateTeacherPassword,
} from "../controllers/admin.controllers.js";
import { registerTeacher } from "../controllers/teacher.controllers.js"
import { verifyTeacherJWT } from "../middlewares/teacherAuth.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = new Router();

// router
//   .route("/teacher/register")
//   .post(verifyTeacherJWT, verifyAdminJWT ,registerTeacher);
router
  .route("/student/filter")
  .get(filterStudents);
router
  .route("/student/verify/:id")
  .get(verifyTeacherJWT, verifyAdminJWT, toggleVerifyStudent);
router
  .route("/student/password/:id")
  .patch(verifyTeacherJWT, verifyAdminJWT, updateStudentPassword);
router
  .route("/teacher/password/:id")
  .delete(verifyTeacherJWT, verifyAdminJWT, updateTeacherPassword);

router.route("/student/delete/:id").delete(verifyTeacherJWT, verifyAdminJWT, deleteStudent);

export default router;
