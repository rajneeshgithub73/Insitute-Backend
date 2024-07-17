import { Router } from "express";
import {
  addFeedback
} from "../controllers/feedback.controllers.js";
import { verifyStudentOrTeacherJWT } from "../middlewares/studentOrTeacherAuth.middleware.js";

const router = Router();

router.route("/add").post(verifyStudentOrTeacherJWT, addFeedback);

export default router;