import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

export const verifyStudentOrTeacherJWT = async (req, res, next) => {
  console.log("hello");
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const student = await Student.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    const teacher = await Teacher.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if(student){
      req.student = student;
    }else{
      req.teacher = teacher;
    }
    next();
  } catch (error) {
    res.status(401).json(new ApiResponse(401, {}, "Unauthorized access"))
  }
};
