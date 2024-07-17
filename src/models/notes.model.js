import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    gradeValue: {
        type: Number,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    chapterNo: {
        type: Number,
        required: true,
    },
    chapterName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    fileURL: {
        type: String,
    }
}, { timestamps: true })

export const Notes = mongoose.model('Notes', notesSchema)