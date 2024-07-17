import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    }
}, { timestamps: true })

export const Feedback = mongoose.model('Feedback', feedbackSchema)