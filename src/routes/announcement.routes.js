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

const router = new Router();

router.route("/add").post(verifyTeacherJWT, addAnnouncement);
router.route("/get-list").get(getAnnouncementList);
router.route("/read/:id").get(readAnnouncement);
router
  .route("/update/:id")
  .patch(verifyTeacherJWT, verifyAdminJWT, updateAnnouncement);
router
  .route("/delete/:id")
  .delete(verifyTeacherJWT, verifyAdminJWT, deleteAnnouncement);

export default router;
