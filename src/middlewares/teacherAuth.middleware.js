import { Teacher } from "../models/teacher.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

export const verifyTeacherJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const teacher = await Teacher.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!teacher) {
      throw new ApiError(401, "Unauthorized access");
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    res.status(401).json(new ApiResponse(401, {}, error.message))
  }
};
