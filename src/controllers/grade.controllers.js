import { Grade } from "../models/grade.model.js";

const addGrade = async (req, res) => {
  const { gradeValue } = req.body;

  console.log(req.body);

  console.log(gradeValue);

  const grade = await Grade.create({
    gradeValue: gradeValue,
  });

  res.status(200).json({ message: "grade created successfully", grade: grade });
};

const getGradeSubjects = async (req, res) => {
  const { gradeValue } = req.params;

//   console.log(gradeValue);

  const gradeSubjects = await Grade.aggregate([
    {
      $match: { gradeValue: Number(gradeValue) },
    },
    {
      $unwind: "$subject",
    },
    {
      $lookup: {
        from: "subjects",
        localField: "subject",
        foreignField: "_id",
        as: "subject_details",
      },
    },
    {
      $unwind: "$subject_details",
    },
    {
      $group: {
        _id: "$_id",
        gradeValue: {
          $first: "$gradeValue",
        },
        subject_details: {
          $push: "$subject_details",
        },
      },
    },
  ]);

//   console.log(gradeSubjects);

  res.status(200).json({ gradeSubjectDetails: gradeSubjects });
};

export { addGrade, getGradeSubjects };
