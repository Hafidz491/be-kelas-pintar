import mongoose from "mongoose";
import courseModel from "./courseModel.js";

const courseDetailModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["video", "text"],
      default: "video",
    },
    videoId: String,
    text: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

// middleware post
courseDetailModel.post("findOneAndDelete", async (doc) => {
  if (doc) {
    // after delete content must update data who related with content model
    await courseModel.findByIdAndUpdate(doc.course, {
      $pull: {
        details: doc._id,
      },
    });
  }
});

export default mongoose.model("CourseDetail", courseDetailModel);
