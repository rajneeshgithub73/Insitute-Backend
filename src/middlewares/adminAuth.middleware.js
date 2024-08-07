import { Admin } from "../models/admin.model.js";

export const verifyAdminJWT = async (req, res, next) => {
  try {
    const admin = await Admin.find({ admin: req.teacher?._id });

    if (!admin) {
      throw new Error("Unauthorized Access");
    }

    req.admin = true;
    next();
  } catch (error) {
    throw new Error(error?.message || "Unauthorized Access");
  }
};
