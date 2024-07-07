import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true
    },
    gradeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    marks: {
        type: Number,
        required: true
    }
}, { timestamps: true })

export const Result = mongoose.model('Result', resultSchema)