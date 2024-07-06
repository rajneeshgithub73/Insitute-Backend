import { Subject } from "../models/subject.model.js";


const addSubject = async (req, res) => {
    const { subjectName } = req.body

    console.log(req.body)

    console.log(subjectName);

    const subject = await Subject.create({
        subjectName: subjectName
    })

    res.status(200).json({ message: 'grade created successfully', subject: subject })
}

export {
    addSubject
}