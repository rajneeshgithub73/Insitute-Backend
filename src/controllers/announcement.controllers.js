import { Announcement } from "../models/announcement.model";

const addAnnouncement = async (req, res) => {
  const { title, content, date } = req.body;

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
    announcer: req.teacher?._id || req.admin?._id,
    title: title,
    content: content,
    date: date,
  });

  if (!announcement) {
    throw new Error("Announcement is not created!");
  }

  res.status(200).json({
    message: "Announcement created successfully",
  });
};

const getAnnouncementList = async (req, res) => {
  const announcementList = await Announcement.find({
    date: { $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  });

  res.status(200).json({
    announcementList: announcementList,
    message: "Announcement list fetched successfully!",
  });
};

const readAnnouncement = async (req, res) => {
  const { announcementId } = req.params;

  if (!announcementId) {
    throw new Error("Invalid announcement!");
  }

  const announcement = await Announcement.findById(announcementId);
  // aggregation pipeline to get the announcerdetails from the announcement

  if (!announcement) {
    throw new Error("Announcement not found!");
  }

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