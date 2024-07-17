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
    studentName: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    }
}, { timestamps: true })

export const Result = mongoose.model('Result', resultSchema)