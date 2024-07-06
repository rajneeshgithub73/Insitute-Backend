import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const gradeSchema = new mongoose.Schema({
    gradeValue: {
        type: Number
    },
    subject: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ]
}, { timestamps: true })

gradeSchema.plugin(mongooseAggregatePaginate)

export const Grade = mongoose.model('Grade', gradeSchema)