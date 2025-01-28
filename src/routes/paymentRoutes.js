import express from "express";
import { paymentController } from "../controllers/paymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/handle-payment-midtrans", paymentController);

export default paymentRoutes;
