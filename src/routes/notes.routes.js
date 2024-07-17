import { Router } from "express";
import { addNotes, getNote, getSubjectNotes } from "../controllers/notes.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/notes/add").post(upload.single("notes"), getGradeSubjects);
router.route("/notes/:gradeValue/:subjectName").get(getSubjectNotes);
router.route("/notes/:id").get(getNote)

export default router;