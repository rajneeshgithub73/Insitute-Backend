import { Router } from "express";
import {
  addGrade,
  getGradeSubjects,
} from "../controllers/grade.controllers.js";

const router = Router();

router.route("/subjects/:gradeValue").get(getGradeSubjects);
router.route("/add").post(addGrade);

export default router;
