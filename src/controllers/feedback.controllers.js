import { Feedback } from "../models/feedback.model.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

const addFeedback = async (req, res) => {
  try {
    const { content } = req.body;

    if (content === "") {
      throw new ApiError(400, "Invalid content");
    }

    const username = req.student ? req.student.username : req.teacher.username;

    const feedback = await Feedback.create({
      content,
      username: username,
    });

    if (!feedback) throw new ApiError(400, "Feedback not created");

    res.status(200).json(new ApiResponse(200, {}, "Thanks for feedback"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, {}, error.message));
  }
};

export { addFeedback };
