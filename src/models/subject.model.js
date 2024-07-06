import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String
    }
}, { timestamps: true })

export const Subject = mongoose.model('Subject', subjectSchema)