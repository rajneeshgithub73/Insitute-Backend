import { Router } from "express"
import { addSubject } from "../controllers/subject.controllers.js"

const router = Router()

router.route('/addsubject').post( addSubject )

export default router