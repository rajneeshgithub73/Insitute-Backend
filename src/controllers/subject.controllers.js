import { Subject } from "../models/subject.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

const addSubject = async (req, res) => {
  try {
    const { subjectName } = req.body;

    if (subjectName === "") {
      throw new ApiError(400, "Invalid subject Name");
    }

    const subject = await Subject.create({
      subjectName,
    });

    if (!subject) {
      throw new ApiError(400, "Invalid subject");
    }

    res.status(200).json(new ApiResponse(200, {}, "Subject Created"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
};

const getAllSubjectList = async (req, res) => {
  try {
    const allSubjectList = await Subject.find();
    if (!allSubjectList) {
      throw new ApiError(500, "Error while getting all subjects!");
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allSubjectList,
          "Subject List fetched successfully!!!"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
};

export { addSubject, getAllSubjectList };
