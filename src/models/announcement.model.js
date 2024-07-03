import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    announcer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    announcemenTitle: {
        type: "string",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const Announcement = mongoose.model('Announcement', announcementSchema)