import mongoose from "mongoose";
import { Announcement } from "../models/announcement.model.js";

const addAnnouncement = async (req, res) => {
  console.log(req.body);

  const { announcer, title, content, date } = req.body;

  if (title === "") {
    throw new Error("Announcement title is required!");
  }
  if (content === "") {
    throw new Error("Announcement content is required!");
  }
  if (date === "") {
    throw new Error("Announcement date is required!");
  }

  const announcement = await Announcement.create({
    // announcer: req.teacher?._id || req.admin?._id,
    announcer: announcer,
    title: title,
    content: content,
    date: date,
  });

  if (!announcement) {
    throw new Error("Announcement is not created!");
  }

  // const response = announcement.json();
  console.log(announcement);

  res.status(200).json({
    announcement: announcement,
    message: "Announcement created successfully",
  });
};

const getAnnouncementList = async (req, res) => {
  try {
    const announcementList = await Announcement.find();
    console.log(announcementList);

    res.status(200).json({
      announcement: announcementList,
      message: "Announcement list fetched successfully!",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const readAnnouncement = async (req, res) => {
  const { id } = req.params;

  console.log(id);

  if (!id) {
    throw new Error("Invalid announcement!");
  }

  const announcement = await Announcement.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "announcer",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $project: {
        _id: 1,
        announcer: 1,
        title: 1,
        date: 1,
        content: 1,
        fullName: { $arrayElemAt: ["$owner.fullName", 0] },
      },
    },
  ]);

  if (!announcement) {
    throw new Error("Announcement not found!");
  }

  console.log(announcement);

  res.status(200).json({
    announcement: announcement,
    message: "announcement fetched successfully!",
  });
};

const updateAnnouncement = async (req, res) => {
  const { title, date, content } = req.body;
  const { id } = req.params;

  if (title === "") {
    throw new Error("Announcement title is required!");
  }
  if (content === "") {
    throw new Error("Announcement content is required!");
  }
  if (date === "") {
    throw new Error("Announcement date is required!");
  }

  const updatedAnnouncement = await Announcement.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        content,
        date,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedAnnouncement) {
    throw new Error("Something went wrong!!");
  }

  res.status(200).json({
    announcement: updatedAnnouncement,
    message: "Announcement updated!!",
  });
};

const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    await Announcement.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }

  res.status(200).json({
    message: "Announcement deleted",
  });
};

export {
  addAnnouncement,
  getAnnouncementList,
  readAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
