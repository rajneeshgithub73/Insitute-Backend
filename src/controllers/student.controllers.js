import { Student } from "../models/student.model.js";
import { uploadOnCloudinary } from "./../utils/cloudinary.utils.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const student = await Student.findById(userId);
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      "Something went wrong while generating access token and refresh token"
    );
  }
};

const registerStudent = async (req, res) => {
  console.log("req.body: ", req.body);

  const {
    fullName,
    fatherName,
    email,
    username,
    password,
    // gradeId,
    age,
    dob,
    phone,
    address,
    // subjectIds,
  } = req.body;

  if (fullName === "") {
    throw new Error("full name is required!");
  }
  if (fatherName === "") {
    throw new Error("father name is required!");
  }
  if (email === "") {
    throw new Error("email is required!");
  }
  if (username === "") {
    throw new Error("username is required!");
  }
  if (password === "") {
    throw new Error("password is required!");
  }
  // if(isNaN(gradeId)) {
  //     throw new Error("grade is required!")
  // }
  if (isNaN(age)) {
    throw new Error("age is required!");
  }
  if (dob === "") {
    let dobObj = new Date(dob);
    if (!isNaN(dobObj) == false) throw new Error("DOB is not a valid date!");
  }
  if (isNaN(phone) && phone.length != 10) {
    throw new Error("phone no is not valid!");
  }
  if (address === "") {
    throw new Error("address is required!");
  }
  // if(subjectIds.length == 0) {
  //     throw new Error("atleast choose one subject!")
  // }

  const existedStudent = await Student.findOne({ username });

  if (existedStudent) {
    throw new Error("Student already exists");
  }

  const avatarLocalPath = req.file?.path;

  // console.log("avatarLocalPath: ", avatarLocalPath)

  if (!avatarLocalPath) {
    throw new Error("Profile picture required!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new Error("Profile picture is required!");
  }

  const student = await Student.create({
    fullName,
    fatherName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    // gradeId,
    age,
    dob: new Date(dob),
    phone,
    address,
    // subjectIds
  });

  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createdStudent) {
    throw new Error("Server error during registration!");
  }

  res.status(200).json({
    student: createdStudent,
    message: "Student registered successfully!",
  });
};

const loginStudent = async (req, res) => {
  const { username, password } = req.body;

  const isStudentExist = await Student.findOne({
    username: username,
  });

  if (!isStudentExist) {
    throw new Error("Student does not exist");
  }

  const isPasswordCorrect = await isStudentExist.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new Error("Password does not match");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    isStudentExist._id
  );

  const studentLoggedIn = await Student.findById(isStudentExist._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json({
      student: studentLoggedIn,
      message: "Student logged in successfully",
    });
};

const logoutStudent = async (req, res) => {
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
    .json({
      student: {},
      message: "Student logout successfully",
    });
};

const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookie?.refresh_token || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new Error("Unathorized refresh token");
  }

  const decodedRefreshToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const student = await Student.findById(decodedRefreshToken?._id);

  if (!student) {
    throw new Error("Invalid refresh token");
  }

  if (incomingRefreshToken !== student.refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      accessToken,
      refreshToken: refreshToken,
      message: "Access token is updated",
    });
};

const changeCurrentPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const student = await Student.findById(req.student?._id);

  const isOldPasswordCorrect = await student.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new Error("Invalid old password!");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    student: {},
    message: "Password updated successfully",
  });
};

const getCurrentStudent = async (req, res) => {
  res.status(200).json({
    student: req.student,
    message: "Current Student fetched successfully",
  });
};

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentStudent,
};
