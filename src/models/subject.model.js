import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String
    },
    gradeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade'
    }
}, { timestamps: true })

export const Subject = mongoose.model('Subject', subjectSchema)