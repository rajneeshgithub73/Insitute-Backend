import { Teacher } from "../models/teacher.model";

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
    throw new Error(
      "Something went wrong while generating access token and refresh token"
    );
  }
};

const loginTeacher = async (req, res) => {
  const { username, password } = req.body;

  const isTeacherExist = await Teacher.findOne({
    username: username,
  });

  if (!isTeacherExist) {
    throw new Error("Teacher does not exist");
  }

  const isPasswordCorrect = await isTeacherExist.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new Error("Password does not match");
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

  res
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json({
      teacher: teacherLoggedIn,
      message: "Teacher logged in successfully",
    });
};

const logoutTeacher = async (req, res) => {
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
    .json({
      teacher: {},
      message: "Teacher logout successfully",
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

  const teacher = await Teacher.findById(decodedRefreshToken?._id);

  if (!teacher) {
    throw new Error("Invalid refresh token");
  }

  if (incomingRefreshToken !== teacher.refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, newRefreshToken } = generateAccessAndRefreshToken(teacher._id)

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json({
      accessToken,
      refreshToken: newRefreshToken,
      message: "Access token is updated",
    });
};

const getCurrentTeacher = async (req, res) => {
  res.status(200).json({
    currentTeacher: req.teacher,
    message: "Current teacher fetched successfully",
  });
};

const changeCurrentPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === "") {
    throw new Error("old password is required!");
  }
  if (newPassword === "") {
    throw new Error("new password is required!");
  }

  const currentTeacher = await Teacher.findById(req.teacher?._id);

  if (!currentTeacher) {
    throw new Error("Unathorized request!");
  }

  const isOldPasswordCorrect = currentTeacher.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new Error("Invalid old password!");
  }

  currentTeacher.password = newPassword;

  currentTeacher.save({ validateBeforeSave: false });

  res.status(200).json({
    teacher: {},
    message: "Password changed succesfully!",
  });
};

export {
  loginTeacher,
  logoutTeacher,
  refreshAccessToken,
  getCurrentTeacher,
  changeCurrentPassword,
};
