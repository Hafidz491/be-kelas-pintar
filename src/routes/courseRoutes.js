import express from "express";
import { getCourses } from "../controllers/courseController.js";
import verifyToken from "../middleware/verifyToken.js";

const courseRoutes = express.Router();

courseRoutes.get("/courses", verifyToken, getCourses);

export default courseRoutes;
