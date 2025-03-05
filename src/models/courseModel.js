import mongoose from "mongoose";
import categoryModel from "./categoryModel.js";
import userModel from "./userModel.js";
import courseDetailModel from "./courseDetailModel.js";

const courseModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  details: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseDetail",
    },
  ],
});

// middleware post
courseModel.post("findOneAndDelete", async (doc) => {
  if (doc) {
    // after delete course must update data who related with course model
    await categoryModel.findByIdAndUpdate(doc.category, {
      $pull: { courses: doc._id },
    });

    await courseDetailModel.deleteMany({
      course: doc._id,
    });

    doc.students?.map(async (std) => {
      await userModel.findByIdAndUpdate(std._id, {
        $pull: { courses: doc._id },
      });
    });
  }
});

export default mongoose.model("Course", courseModel);
