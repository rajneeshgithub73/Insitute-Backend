import { Router } from "express"
import { addSubject, getAllSubjectList } from "../controllers/subject.controllers.js"

const router = Router()

router.route('/add').post( addSubject )
router.route('/subject-list').get( getAllSubjectList )

export default router