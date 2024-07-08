import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}, { timestamps: true })

export const Admin = mongoose.model('Admin', adminSchema)