import { Router } from "express";
import {
  addAnnouncement,
  getAnnouncementList,
  readAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controllers";

const router = new Router();

router.route("/add").post(addAnnouncement);
router.route("/get-list").get(getAnnouncementList);
router.route("/read/:id").get(readAnnouncement);
router.route("/update/:id").patch(updateAnnouncement);
router.route("/delete/:id").delete(deleteAnnouncement);

export default router;
