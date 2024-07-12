import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";

export const verifyStudentOrTeacherJWT = async (req, res, next) => {

    console.log(req.header('Authorization'))
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("token: ", token);

    if (!token) {
      throw new Error("Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const student = await Student.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!student) {
      const teacher = await Teacher.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!teacher) {
        throw new Error("Invalid access token");
      }

      req.teacher = teacher;
      next();
    }

    req.student = student;
    next();
  } catch (error) {
    throw new Error(error?.message || "Invalid access token");
  }
};
