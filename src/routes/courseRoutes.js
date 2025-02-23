import express from "express";
import {
  getCourses,
  postCourse,
  updateCourse,
} from "../controllers/courseController.js";
import verifyToken from "../middleware/verifyToken.js";
import multer from "multer";
import { fileStorageCourse, fileFilter } from "../utils/multer.js";

const courseRoutes = express.Router();
const upload = multer({
  storage: fileStorageCourse,
  fileFilter: fileFilter,
});

courseRoutes.get("/courses", verifyToken, getCourses);
courseRoutes.post(
  "/courses",
  verifyToken,
  upload.single("thumbnail"),
  postCourse
);

courseRoutes.put(
  "/courses/:id",
  verifyToken,
  upload.single("thumbnail"),
  updateCourse
);

export default courseRoutes;
