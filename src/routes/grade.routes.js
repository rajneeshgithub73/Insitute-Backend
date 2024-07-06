import { Router } from "express"
import { addGrade, getGradeSubjects } from "../controllers/grade.controllers.js"

const router = Router()

router.route('/addgrade').post( addGrade )
router.route('/subjects/:gradeValue').get( getGradeSubjects )

export default router