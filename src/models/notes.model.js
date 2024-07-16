import { required } from "joi";
import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    gradeValue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
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