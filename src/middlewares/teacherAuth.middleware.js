import { Teacher } from "../models/teacher.model.js";
import jwt from "jsonwebtoken";

export const verifyTeacherJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const teacher = await Teacher.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!teacher) {
      throw new Error("Invalid access token");
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    throw new Error(error?.message || "Invalid access token");
  }
};
