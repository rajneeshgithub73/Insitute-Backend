import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true
    },
    gradeValue: {
        type: Number,
        required: true
    },
    subjectName: {
        type: String,
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