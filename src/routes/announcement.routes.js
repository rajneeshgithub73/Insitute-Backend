import { Router } from "express";
import {
  addAnnouncement,
  getAnnouncementList,
  readAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controllers.js";
import { verifyTeacherJWT } from "../middlewares/teacherAuth.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import { verifyStudentOrTeacherJWT } from "../middlewares/studentOrTeacherAuth.middleware.js";

const router = new Router();

router.route("/add").post(verifyTeacherJWT, addAnnouncement);

router.route("/get-list").get(verifyStudentOrTeacherJWT, getAnnouncementList);
router.route("/read/:id").get(verifyStudentOrTeacherJWT, readAnnouncement);
router
  .route("/update/:id")
  .patch(verifyTeacherJWT, verifyAdminJWT, updateAnnouncement);
router
  .route("/delete/:id")
  .delete(verifyTeacherJWT, verifyAdminJWT, deleteAnnouncement);

export default router;
