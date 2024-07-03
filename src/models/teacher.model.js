import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    gradeIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Grade',
            required: true
        }
    ],
    age: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    subjectIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        }
    ],
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

export const Teacher = mongoose.model('Teacher', teacherSchema)