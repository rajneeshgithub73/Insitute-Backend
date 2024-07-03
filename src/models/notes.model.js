import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
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
    notesTitle: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const Notes = mongoose.model('Notes', notesSchema)