import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import { Student } from "./../models/student.model.js";
import { Teacher } from "./../models/teacher.model.js";

const filterStudents = async (req, res) => {
  try {
    const query = req.query;
    console.log(query);
    const gradeValue = query.gradeValue;
    const isVerified = query.isVerified;

    const filterStudentsList = await Student.find({
      gradeValue: gradeValue,
      isVerified: isVerified,
    }).select("fullName username avatar isVerified _id");

    if (!filterStudentsList) {
      throw new ApiError(500, "Students Fetching failed");
    }

    console.log(filterStudentsList);

    res
      .status(200)
      .json(
        new ApiResponse(200, filterStudentsList, "Student Fetching Success")
      );
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw new ApiError(400, "Invalid student");
    }

    try {
      await Student.findByIdAndDelete(id);
    } catch (error) {
      throw new ApiError(500, "Delete student failed");
    }

    res.status(200).json(new ApiResponse(200, {}, "Student deleted!"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
};

const toggleVerifyStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new ApiError(400, "Invalid student");
    }

    const student = await Student.findById(id);

    if (!student) {
      throw new ApiError(400, "Student not found");
    }

    student.isVerified = !student.isVerified;
    try {
      await student.save({
        validateBeforeSave: false,
      });
    } catch (error) {
      throw new ApiError(400, "Toggle failed");
    }
    res.status(200).json(new ApiResponse(200, {}, "Toggle Success"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
};

const updatePassword = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === "") {
      throw new ApiError(400, "username required");
    }

    if (password === "") {
      throw new ApiError(400, "password required");
    }

    const student = await Student.find({
      username: username,
    });

    const teacher = await Teacher.find({
      username: username,
    });

    if (student) {
      student.password = password;
      await student.save({ validateBeforeSave: false });
    } else if (teacher) {
      teacher.password = password;
      await teacher.save({ validateBeforeSave: false });
    } else {
      throw new ApiError(400, "user not found");
    }

    res.status(200).json(new ApiResponse(200, {}, "Password updated"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
};

export { filterStudents, deleteStudent, toggleVerifyStudent, updatePassword };
