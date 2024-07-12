import jwt from "jsonwebtoken";
import { ApiError } from "./../utils/apiError.utils.js";
import { ApiResponse } from "./../utils/apiResponse.utils.js";
import { Student } from "../models/student.model.js";

export const verifyStudentJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const student = await Student.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!student) {
      throw new ApiError(400, "Invalid Access Token");
    }

    req.student = student;
    next();
  } catch (error) {
    res.status(401).json(new ApiResponse(error.statusCode, {}, error.message));
  }
};
