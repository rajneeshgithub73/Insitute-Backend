import { Teacher } from "../models/teacher.model.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "./../utils/cloudinary.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const teacher = await Teacher.findById(userId);
    const accessToken = teacher.generateAccessToken();
    const refreshToken = teacher.generateRefreshToken();

    teacher.refreshToken = refreshToken;
    await teacher.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access token");
  }
}; // generateAccessAndRefreshToken completed

const registerTeacher = async (req, res) => {
  try {
    const teacherRegisterSchema = Joi.object({
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
      gradeValues: Joi.array().required().min(1),
      subjectNames: Joi.array().required().min(1),
    });

    const { error, value } = teacherRegisterSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    const {
      fullName,
      fatherName,
      email,
      username,
      password,
      age,
      dob,
      phone,
      address,
      gradeValues,
      subjectNames,
    } = req.body;

    const existedTeacher = await Teacher.findOne({ username });

    if (existedTeacher) {
      throw new ApiError(409, "Teacher Already Exists!");
    }

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Profile Picture is Required!");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new ApiError(500, "Profile Picture is Required!");
    }

    const teacher = await Teacher.create({
      fullName,
      fatherName,
      email,
      username: username.toLowerCase(),
      password,
      avatar: avatar.url,
      age,
      dob,
      phone,
      address,
      gradeValues,
      subjectNames,
    });

    const createdTeacher = await Teacher.findById(teacher._id).select(
      "-password -refreshToken"
    );

    if (!createdTeacher) {
      throw new ApiError(500, "Server Error during Registration!");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          teacher: createdTeacher,
        },
        "Teacher registered successfully!"
      )
    );
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
}; // Register teacher completed

const loginTeacher = async (req, res) => {
  try {
    const teacherLoginSchema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error, value } = teacherLoginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    const { username, password } = req.body;

    const isTeacherExist = await Teacher.findOne({
      username: username,
    });

    if (!isTeacherExist) {
      throw new ApiError(401, "Teacher Doesn't Exist");
    }

    const isPasswordCorrect = await isTeacherExist.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Wrong Password!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      isTeacherExist._id
    );

    const teacherLoggedIn = await Teacher.findById(isTeacherExist._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { teacherLoggedIn, accessToken, refreshToken },
          "Teacher logged in successfully"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(error.statusCode, {}, error.message));
  }
}; // Login teacher completed

const logoutTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndUpdate(
      req.teacher?._id,
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
}; //Logout Teacher completed

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookie?.refresh_token || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(400, "Token Missing!");
    }

    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const teacher = await Teacher.findById(decodedRefreshToken?._id);

    if (!teacher) {
      throw new ApiError(400, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== student.refreshToken) {
      throw new ApiError(401, "Wrong Refresh Token");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = generateAccessAndRefreshToken(
      teacher._id
    );

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
    res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
}; //refreshAccessToken completed

const updateProfile = async (req, res) => {
  try {
    const updateProfileSchema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
      gradeValues: Joi.array().required().min(1),
      subjectNames: Joi.array().required().min(1),
    });

    const { error, value } = updateProfileSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    const { oldPassword, newPassword, gradeValues, subjectNames } = req.body;

    const teacher = await Teacher.findById(req.teacher?._id);

    const isOldPasswordCorrect = await teacher.isPasswordCorrect(oldPassword);

    if (!isOldPasswordCorrect) {
      throw new ApiError(400, "Invalid old Password!");
    }

    teacher.password = newPassword;
    teacher.gradeValues = gradeValues;
    teacher.subjectNames = subjectNames;

    await teacher.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, {}, "Password Updated"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
}; // update Profile completed

const getCurrentTeacher = async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(200, req.teacher, "Current Teacher fetched successfully")
    );
}; // getCurrentTeacher

export {
  registerTeacher,
  loginTeacher,
  logoutTeacher,
  refreshAccessToken,
  updateProfile,
  getCurrentTeacher,
};
