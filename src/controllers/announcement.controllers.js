import mongoose, { isValidObjectId } from "mongoose";
import { Announcement } from "../models/announcement.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import Joi from "joi";

const addAnnouncement = async (req, res) => {
  try {
    const addAnnouncementSchema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      date: Joi.string().required(),
    });

    const { error, value } = addAnnouncementSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    const { title, content, date } = req.body;

    const announcement = await Announcement.create({
      announcer: req.teacher?._id,
      title: title,
      content: content,
      date: date,
    });

    if (!announcement) {
      throw new ApiError(500, "Announcement Failed!");
    }

    res.status(200).json(new ApiResponse(200, announcement, "Announcement Added"));
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
}; // addAnnouncement completed

const getAnnouncementList = async (req, res) => {
  try {
    const announcementList = await Announcement.find();

    if (!announcementList) {
      throw new ApiError(500, "Get Announcement failed");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          announcementList,
          "Announcement list fetched successfully!"
        )
      );
  } catch (error) {
    res
      .status(400)
      .json(new ApiResponse(400, {}, `1: ${error.message}`));
  }
}; // getAnnouncementList completed

const readAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new ApiError(400, "Invalid Announcement!");
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
      throw new ApiError(400, "Announcement Not Found!");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, announcement, "announcement fetched successfully!")
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
}; // readAnnouncement completed

const updateAnnouncement = async (req, res) => {
  try {
    const addAnnouncementSchema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      date: Joi.string().required(),
    });

    const { error, value } = addAnnouncementSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      console.log("joi validation error : ", error);
      throw new ApiError(400, error.message);
    }

    const { title, content, date } = req.body;

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new ApiError(400, "invalid announcement");
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
      throw new ApiError(500, "Update Failed!");
    }

    res.status(200).json(new ApiResponse(200, {}, "Announcement updated"));
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
}; // updateAnnouncement completed

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new ApiError(400, "invalid announcement");
    }

    try {
      await Announcement.findByIdAndDelete(id);
    } catch (error) {
      throw new ApiError(500, error.message);
    }

    res.status(200).json(new ApiResponse(200, {}, "Announcement Deleted!"));
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
}; // deleteAnnouncement completed

export {
  addAnnouncement,
  getAnnouncementList,
  readAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
