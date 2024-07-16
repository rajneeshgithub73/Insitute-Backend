import Joi from "joi";
import { Grade } from "../models/grade.model.js";
import { ApiError } from "./../utils/apiError.utils.js";
import { ApiResponse } from "./../utils/apiResponse.utils.js";

const getGradeSubjects = async (req, res) => {
  try {
    const { gradeValue } = req.params;

    if (gradeValue === "") {
      throw new ApiError(400, "Invalid grade value");
    }

    const gradeSubjects = await Grade.findOne({
      gradeValue: gradeValue,
    });

    if (!gradeSubjects) {
      throw new ApiError(500, "Error getting subjects");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, gradeSubjects.subjectNames, "Subject List Fetched Successfully")
      );
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
};

const addGrade = async (req, res) => {
  console.log(req.body);
  try {
    const addGradeSchema = Joi.object({
      gradeValue: Joi.number().required().min(6).max(12),
      subjectNames: Joi.array().required().min(1),
    });

    const { error, value } = addGradeSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    const { gradeValue, subjectNames } = req.body;

    const grade = await Grade.create({
      gradeValue,
      subjectNames,
    });

    if (!grade) {
      throw new ApiError(500, "Grade not added");
    }

    res.status(200).json(new ApiResponse(200, {}, "Grade Added"));
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
};

export { getGradeSubjects, addGrade };
