import jwt from "jsonwebtoken";
import { Student } from "../models/student.model";

export const verifyStudentJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const student = await Student.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!student) {
      throw new Error("Invalid access token");
    }

    req.student = student;
    next();
  } catch (error) {
    throw new Error(error?.message || "Invalid access token");
  }
};
