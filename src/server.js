import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.use(cookieParser());

// route import

import studentRouter from "./routes/student.routes.js";
import gradeRouter from "./routes/grade.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import announcementRouter from "./routes/announcement.routes.js";
import { ApiError } from "./utils/apiError.utils.js";
import { ApiResponse } from "./utils/apiResponse.utils.js";

// route declaration

app.get("/api/test", (req, res) => {
  try {
    console.log("everything is going smooth");
    // throw new ApiError(400, "error occored");
    res
      .status(200)
      .json(new ApiResponse(200, { name: "rajneesh" }, "successfull!"));
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(new ApiResponse(400, {}, error.message || "mye error!"));
  }
});

app.use("/api/v1/student", studentRouter);
app.use("/api/v1/grade", gradeRouter);
app.use("/api/v1/subject", subjectRouter);
app.use("/api/v1/announcement", announcementRouter);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port :${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed: ", err);
  });
