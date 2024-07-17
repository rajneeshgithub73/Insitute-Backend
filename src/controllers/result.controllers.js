import Joi from "joi";
import { ApiError } from "../utils/apiError.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { Result } from "../models/result.model.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

const addResult = async (req, res) => {
  try {
    const addResultSchema = Joi.object({
      year: Joi.number().required(),
      gradeValue: Joi.number().required().min(6).max(12),
      subjectName: Joi.string().required(),
      studentName: Joi.string().required(),
      marks: Joi.number().required().min(0).max(100),
    });

    const { error, value } = addResultSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) throw new ApiError(400, error.message);

    const { year, gradeValue, subjectName, marks } = req.body;

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) throw new ApiError(400, "Avatar is Required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) throw new ApiError(400, "avatar upload failed");

    const result = await Result.create({
      year,
      gradeValue,
      subjectName,
      marks,
      avatar: avatar.url,
    });

    if (!result) throw new ApiError(400, "result upload failed");

    res.status(200).json(new ApiResponse(200, {}, "Result Uploaded"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
};

const filterResult = async (req, res) => {
  try {
    const { gradeValue, subjectName } = req.query;
    const filterResultSchema = Joi.object({
      gradeValue: Joi.number().required().min(6).max(10),
      subjectName: Joi.string().required(),
    });

    const { error, value } = filterResultSchema.validate(req.query, {
      abortEarly: false,
    });

    if (error) throw new ApiError(400, error.message);

    const results = await find({
      gradeValue: gradeValue,
      subjectName: subjectName,
    });

    if (!results) throw new ApiError(400, "Result not found");

    res.status(200).json(new ApiResponse(200, "Result Fetched"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
};

export { addResult, filterResult };
