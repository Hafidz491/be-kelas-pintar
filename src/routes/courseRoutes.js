import express from "express";
import {
  getCourses,
  postCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  getCourseById,
  postContentCourse,
  updateContentCourse,
  deleteContentCourse,
  getDetailContent,
} from "../controllers/courseController.js";
import verifyToken from "../middleware/verifyToken.js";
import multer from "multer";
import { fileStorageCourse, fileFilter } from "../utils/multer.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { mutateContentSchema } from "../utils/schema.js";
import { deleteModel } from "mongoose";

const courseRoutes = express.Router();
const upload = multer({
  storage: fileStorageCourse,
  fileFilter: fileFilter,
});

courseRoutes.get("/courses", verifyToken, getCourses);
courseRoutes.get("/categories", verifyToken, getCategories);
courseRoutes.get("/courses/:id", verifyToken, getCourseById);
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

courseRoutes.delete("/courses/:id", verifyToken, deleteCourse);

courseRoutes.post(
  "/courses/contents",
  verifyToken,
  validateRequest(mutateContentSchema),
  postContentCourse
);

courseRoutes.put(
  "/courses/contents/:id",
  verifyToken,
  validateRequest(mutateContentSchema),
  updateContentCourse
);

courseRoutes.delete("/courses/contens/:id", verifyToken, deleteContentCourse);
courseRoutes.get("/courses/contents/:id", verifyToken, getDetailContent);

export default courseRoutes;
