import Joi from "joi";
import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { uploadOnCloudinary } from "./../utils/cloudinary.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const student = await Student.findById(userId);
    const accessToken = student.generateAccessToken();
    const newRefreshToken = student.generateRefreshToken();

    student.refreshToken = newRefreshToken;
    await student.save({
      validateBeforeSave: false,
    });
    // console.log("1 :");
    // console.table([accessToken, newRefreshToken]);

    return { accessToken, newRefreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access token");
  }
}; // generateAccessAndRefreshToken completed

const registerStudent = async (req, res) => {
  try {
    const studentRegisterSchema = Joi.object({
      fullName: Joi.string().required(),
      fatherName: Joi.string().required(),
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      age: Joi.number().required().min(0).max(100),
      dob: Joi.date().required(),
      phone: Joi.string()
        .length(10)
        .pattern(/[6-9]{1}[0-9]{9}/)
        .required(),
      address: Joi.string().required(),
      gradeValue: Joi.number().required().min(6).max(12),
      subjectNames: Joi.array().required().min(1),
    });

    const { error, value } = studentRegisterSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      console.log("joi validation error : ", error);
      throw new ApiError(400, error.message);
    }

    const {
      fullName,
      fatherName,
      email,
      username,
      password,
      gradeValue,
      age,
      dob,
      phone,
      address,
      subjectNames,
    } = req.body;

    const existedStudent = await Student.findOne({ username });

    if (existedStudent) {
      throw new ApiError(409, "Student Already Exists!");
    }

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Profile Picture is Required!");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new ApiError(500, "Profile Picture is Required!");
    }

    const student = await Student.create({
      fullName,
      fatherName,
      email,
      username: username.toLowerCase(),
      password,
      avatar: avatar.url,
      gradeValue,
      age,
      dob: dob,
      phone,
      address,
      subjectNames,
    });

    const createdStudent = await Student.findById(student._id).select(
      "-password -refreshToken"
    );

    if (!createdStudent) {
      throw new ApiError(500, "Server Error during Registration!");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          student: createdStudent,
        },
        "Student registered successfully!"
      )
    );
  } catch (error) {
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
}; // Register student completed

const loginStudent = async (req, res) => {
  try {
    const studentLoginSchema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error, value } = studentLoginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    const { username, password } = req.body;

    const isStudentExist = await Student.findOne({
      username: username,
    });

    if (!isStudentExist) {
      throw new ApiError(401, "Student Doesn't Exist");
    }

    const isPasswordCorrect = await isStudentExist.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Wrong Password!");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(isStudentExist._id);

    const studentLoggedIn = await Student.findById(isStudentExist._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { studentLoggedIn, accessToken, refreshToken: newRefreshToken },
          "Student logged in successfully"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(error.statusCode, {}, error.message));
  }
}; // Login student completed

const logoutStudent = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(
      req.student?._id,
      {
        $set: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, {}, "logout successfull"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, {}, "logout failed"));
  }
}; // Logout student completed

const refreshAccessToken = async (req, res) => {
  try {
    // console.log("cookies : ",req.cookies);

    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(400, "Token Missing!");
    }

    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const student = await Student.findById(decodedRefreshToken?._id);

    if (!student) {
      throw new ApiError(400, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== student.refreshToken) {
      throw new ApiError(401, "Wrong Refresh Token");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(student._id);
    // console.log("2");
    // console.table([accessToken, newRefreshToken]);

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token is updated"
        )
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
}; // refreshAccessToken completed

const updateProfile = async (req, res) => {
  try {
    const updateProfileSchema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
      // gradeValue: Joi.string().required(),
      subjectNames: Joi.array().required().min(1),
    });

    const { error, value } = updateProfileSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    const {
      oldPassword,
      newPassword,
      // gradeValue
      subjectNames,
    } = req.body;

    const student = await Student.findById(req.student?._id);

    const isOldPasswordCorrect = await student.isPasswordCorrect(oldPassword);

    if (!isOldPasswordCorrect) {
      throw new ApiError(400, "Invalid old Password!");
    }

    student.password = newPassword;
    // student.gradeValue = gradeValue;
    student.subjectNames = subjectNames;

    await student.save({ validateBeforeSave: false });

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Profile Updated"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}; // update Profile completed

const getCurrentStudent = async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(200, req.student, "Current Student fetched successfully")
    );
}; //getCurrentStudent completed

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  refreshAccessToken,
  updateProfile,
  getCurrentStudent,
};
