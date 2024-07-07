import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const announcementSchema = new mongoose.Schema(
  {
    announcer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    title: {
      type: "string",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

announcementSchema.plugin(mongooseAggregatePaginate);

export const Announcement = mongoose.model("Announcement", announcementSchema);