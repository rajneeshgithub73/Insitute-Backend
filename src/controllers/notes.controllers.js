import Joi from "joi";
import { ApiError } from "../utils/apiError.utils";
import { Notes } from "../models/notes.model";
import { uploadOnCloudinary } from "../utils/cloudinary.utils";
import { ApiResponse } from "../utils/apiResponse.utils";
import { isValidObjectId } from "mongoose";

const addNotes = async (req, res) => {
  try {
    const addNotesSchema = Joi.object({
      gradeValue: Joi.number().required().min(6).max(12),
      subjectId: Joi.string().required(),
      chapterName: Joi.string().required(),
      title: Joi.string().required(),
      content: Joi.string(),
    });

    const { error, value } = addNotesSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    const { gradeValue, subjectId, chapterName, title, content } = req.body;

    const fileLocalPath = req.file?.path;

    if (!fileLocalPath) {
      throw new ApiError(400, "Notes File Missing!");
    }

    const fileURL = await uploadOnCloudinary(fileLocalPath);

    if (!fileURL) {
      throw new ApiError(500, "File upload failed");
    }

    const createNote = await Notes.create({
      gradeValue,
      subjectId,
      chapterName,
      title,
      content,
      fileURL,
    });

    if (!createNote) {
      throw new ApiError(500, "Upload Failed");
    }

    res.status(200).json(new ApiResponse(200, {}, "Notes Uploaded!"));
  } catch (error) {
    res.status(error.statusCode).json(error.statusCode, {}, error.message);
  }
};

const getSubjectNotes = async (req, res) => {
  try {
    const { gradeValue, subjectId } = req.params;
    if (gradeValue < 6 || gradeValue > 12) {
      throw new ApiError(400, "Invalid grade");
    }
    if (!isValidObjectId(subjectId)) {
      throw new ApiError(400, "Invalid subjectId");
    }

    const notes = Notes.find({
      gradeValue: gradeValue,
      subjectId: subjectId,
    });

    if (!notes) {
      throw new ApiError(500, "Notes not found");
    }

    res.status(200).json(new ApiResponse(200, notes, "Notes fetched"));
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
};

const getNote = async (req, res) => {};

export { addNotes, getGradeNotes, getSubjectNotes, getNote };
