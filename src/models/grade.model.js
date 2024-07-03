import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
    gradeValue: {
        type: Number,
    },
    subject: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ]
}, { timestamps: true })

export const Grade = mongoose.model('Grade', gradeSchema)