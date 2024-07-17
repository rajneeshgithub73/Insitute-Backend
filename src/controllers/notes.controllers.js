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
      subjectName: Joi.string().required(),
      chapterNo: Joi.number().required().min(1),
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

    const { gradeValue, subjectName, chapterNo, chapterName, title, content } =
      req.body;

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
      subjectName,
      chapterNo,
      chapterName,
      title,
      content,
      fileURL: fileURL.url,
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
    const { gradeValue, subjectName } = req.params;
    if (gradeValue < 6 || gradeValue > 12) {
      throw new ApiError(400, "Invalid Grade");
    }
    if (subjectName === "") {
      throw new ApiError(400, "Invalid Subject Name");
    }

    const notes = Notes.find({
      gradeValue: gradeValue,
      subjectName: subjectName,
    });

    if (!notes) {
      throw new ApiError(500, "Notes Not found");
    }

    res.status(200).json(new ApiResponse(200, notes, "Notes Fetched"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
};

const getNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) throw new ApiError(400, "Invalid Notes");

    const note = await Notes.findById(id);

    if (!note) throw new ApiError(400, "Notes not found");

    res
      .status(200)
      .json(new ApiResponse(200, note, "notes fetched successfully"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
};

export { addNotes, getGradeNotes, getSubjectNotes, getNote };
