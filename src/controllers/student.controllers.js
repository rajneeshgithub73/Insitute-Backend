import mongoose from "mongoose"
import { Student } from "../models/student.model.js"
import { uploadOnCloudinary } from "./../utils/cloudinary.utils.js";

const registerStudent = async(req, res) => {

    console.log("req.body: ", req.body)

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
    } = req.body

    if(fullName === "") {
        throw new Error("full name is required!")
    }
    if(fatherName === "") {
        throw new Error("father name is required!")
    }
    if(email === "") {
        throw new Error("email is required!")
    }
    if(username === "") {
        throw new Error("username is required!")
    }
    if(password === "") {
        throw new Error("password is required!")
    }
    // if(isNaN(gradeId)) {
    //     throw new Error("grade is required!")
    // }
    if(isNaN(age)) {
        throw new Error("age is required!")
    }
    if(dob === "") {
        let dobObj = new Date(dob)
        if(!isNaN(dobObj) == false)
            throw new Error("DOB is not a valid date!")
    }
    if(isNaN(phone) && phone.length != 10) {
        throw new Error("phone no is not valid!")
    }
    if(address === "") {
        throw new Error("address is required!")
    }
    // if(subjectIds.length == 0) {
    //     throw new Error("atleast choose one subject!")
    // }

    const existedStudent = await Student.findOne({ username })

    if(existedStudent) {
        throw new Error("Student already exists")
    }

    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath) {
        throw new Error("Profile picture required!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar) {
        throw new Error("Profile picture is required!")
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
    })

    const createdStudent = await Student.findById(student._id).select(
        "-password -refreshToken"
    )

    if(!createdStudent) {
        throw new Error("Server error during registration!")
    }

    res.status(200).json({
        student: createdStudent,
        message: "Student registered successfully!"
    })
}

export { registerStudent }