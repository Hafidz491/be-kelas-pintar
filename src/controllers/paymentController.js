import transactionModel from "../models/transactionModel.js";
import mongoose from "mongoose";

export const paymentController = async (req, res) => {
  try {
    const body = req.body;

    console.log("=== Midtrans Callback Received ===");
    console.log(JSON.stringify(body, null, 2));
    console.log("===================================");

    const objectId = mongoose.isValidObjectId(body.order_id)
      ? new mongoose.Types.ObjectId(body.order_id)
      : body.order_id;
    console.log(objectId);

    console.log("Order ID from Midtrans:", body.order_id);
    console.log("Converted Object ID:", objectId);

    let updateTransaction = null;

    switch (body.transaction_status) {
      case "capture":
      case "settlement":
        updateTransaction = await transactionModel.findByIdAndUpdate(
          objectId,
          {
            status: "success",
          },
          { new: true }
        );
        break;
      case "deny":
      case "cancel":
      case "expire":
      case "pending":
      case "failure":
        updateTransaction = await transactionModel.findByIdAndUpdate(
          objectId,
          {
            status: "failed",
          },
          { new: true }
        );
        break;
    }

    if (!updateTransaction) {
      return res.status(404).json({ error: "Transaction not found!" });
    }

    console.log("Updated Transaction:", updateTransaction);

    return res.json({
      message: "Payment Success!",
      data: updateTransaction,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Internal Server Error!" });
  }
};
